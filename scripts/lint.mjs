// Rule checker for posts/<id>/post.json. Deterministic, no AI.
// Usage: node scripts/lint.mjs posts/<id> [...]
// New rules must pass on every post in posts/_golden/ before they are enforced (the "original pass test").
import { readFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { parts } from "./caption.mjs";
import { scorePost, FLOOR } from "./hookscore.mjs";

const POSTS = resolve(import.meta.dirname, "..", "posts");

const CATEGORIES = ["POLICY", "INDUSTRY", "ECONOMY", "TOOLS", "RESEARCH", "STARTUPS"];
const HOOK_TYPES = ["number", "claim", "myth-flip", "rivalry", "quote", "reader-impact"];
// Huge tags where a new post sinks in minutes. One is fine as a label, the rest must be specific.
const BROAD_TAGS = ["#ainews", "#ai", "#artificialintelligence", "#technews", "#tech", "#technology", "#machinelearning",
  "#innovation", "#future", "#news", "#chatgpt", "#genai", "#generativeai"];
const NON_LATIN = /[\p{Script=Hangul}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Cyrillic}\p{Script=Arabic}\p{Script=Hebrew}\p{Script=Thai}\p{Script=Devanagari}\p{Script=Greek}]/u;
const REGIONS = ["GLOBAL", "US", "CHINA", "KOREA", "JAPAN", "EUROPE", "ASIA", "OCEANIA", "MIDEAST", "INDIA"];
const words = s => String(s).replace(/\*\*/g, "").trim().split(/\s+/).filter(Boolean).length;
const plain = s => String(s).replace(/\*\*/g, "");
const emphCount = s => (String(s).match(/\*\*(.+?)\*\*/g) || []).length;
const numbers = s => (plain(s).match(/\d[\d,.]*/g) || []).map(n => n.replace(/[.,]$/, ""));

function lint(post) {
  const e = [];
  const req = (cond, msg) => { if (!cond) e.push(msg); };
  // Sunday roundup (PRD 2026-10-26): items are copied from published posts, so some rules differ. Without `kind`, a single story.
  const weekly = post.kind === "weekly";

  req(/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(post.id || ""), "id must look like 2026-10-21-short-slug");
  if (weekly) req(post.category === "WEEKLY", 'weekly: category must be "WEEKLY"');
  else req(CATEGORIES.includes(post.category), `category must be one of ${CATEGORIES.join(", ")}`);

  // cover
  const c = post.cover || {};
  if (weekly) req(c.tag === "GLOBAL AI · WEEKLY", 'weekly: cover.tag must be "GLOBAL AI · WEEKLY"');
  else req(REGIONS.some(r => c.tag === `${r} AI · ${post.category}`), `cover.tag must be "<REGION> AI · ${post.category}", REGION one of ${REGIONS.join(", ")}`);
  req(Array.isArray(c.headline) && c.headline.length === 2, "cover.headline must be exactly 2 lines");
  (c.headline || []).forEach((l, i) => req(plain(l).length <= 16, `cover line ${i + 1} is ${plain(l).length} chars (max 16)`));
  req((c.headline || []).reduce((n, l) => n + emphCount(l), 0) === 1, "cover needs exactly one **emphasis**");
  req(Array.isArray(c.hook_options) && c.hook_options.length >= 3 && c.hook_options.length <= 5, "cover.hook_options needs 3-5 candidates");
  req((c.hook_options || []).some(h => JSON.stringify(h) === JSON.stringify(c.headline)), "cover.headline must be one of cover.hook_options");
  // hook types (added 2026-10-21): optional so posts made before the rule still pass
  if (c.hook_types !== undefined) {
    const types = c.hook_types;
    req(Array.isArray(types) && types.length === (c.hook_options || []).length, "cover.hook_types must list one type per hook option");
    req(Array.isArray(types) && types.every(t => HOOK_TYPES.includes(t)), `cover.hook_types values must be one of ${HOOK_TYPES.join(", ")}`);
    // A reader-impact hook is required unless hook_pick_reason says why there is none (2026-10-28, Jamie): writers had
    // been forcing the label onto hooks for shareholders only when the articles stated no effect on ordinary readers.
    // A roundup cover may have no reader-impact angle either, so the rule is optional there.
    const noImpactReason = /no reader-impact hook:\s*\S.{19,}/i.test(String(c.hook_pick_reason || ""));
    if (!weekly) req(Array.isArray(types) && (types.includes("reader-impact") || noImpactReason),
      'cover.hook_options needs a reader-impact hook, or hook_pick_reason must say why not ("No reader-impact hook: <reason>")');
    const pick = (c.hook_options || []).findIndex(h => JSON.stringify(h) === JSON.stringify(c.headline));
    req(Array.isArray(types) && c.hook_type === types[pick], "cover.hook_type must be the type of the chosen headline");
  }
  req(typeof c.image_prompt === "string" && /no text/i.test(c.image_prompt) && /no people|no real people/i.test(c.image_prompt),
    "cover.image_prompt must say 'no text' and 'no people'");

  // body slides
  const slides = post.slides || [];
  if (weekly) req(slides.length >= 3 && slides.length <= 7, `weekly: need 3-7 story slides (have ${slides.length})`);
  else req(slides.length >= 4 && slides.length <= 6, `need 4-6 body slides (have ${slides.length})`);
  slides.forEach((s, i) => {
    const n = i + 2;
    req(s.kicker && words(s.kicker) <= 4, `slide ${n}: kicker missing or over 4 words`);
    const text = s.quote ? [s.quote, s.who] : (s.body || []);
    req(text.length > 0, `slide ${n}: empty`);
    const w = text.reduce((a, p) => a + words(p), 0) + (s.title ? words(s.title) : 0);
    req(w <= 48, `slide ${n}: ${w} words (max 48)`);
    const em = text.reduce((a, p) => a + emphCount(p), 0);
    req(em <= 2, `slide ${n}: ${em} emphasis marks (max 2)`);
    if (s.quote) req(!!s.who, `slide ${n}: quote needs who`);
  });

  // facts gate: every number shown must appear in a sourced fact
  const facts = post.facts || [];
  req(facts.length >= 3, "need at least 3 facts");
  facts.forEach((f, i) => req(Number.isInteger(f.source) && post.sources?.[f.source], `fact ${i + 1}: source index invalid`));
  const factText = facts.map(f => f.text).join(" ");
  // weekly: only the cover is new; the lead story's facts back it. Story slides are matched to their posts below instead.
  const shown = weekly ? [...(c.headline || [])] : [...(c.headline || []), ...slides.flatMap(s => [s.title || "", ...(s.body || []), s.quote || ""])];
  for (const n of new Set(shown.flatMap(numbers))) {
    req(factText.includes(n), `number "${n}" is not backed by any fact`);
  }

  // sources, caption
  const src = post.sources || [];
  if (weekly) req(src.length >= 1, "need at least 1 source");
  else req(src.length >= 1 && src.length <= 3, "need 1-3 sources");
  src.forEach((s, i) => req(/^https:\/\//.test(s.url || "") && s.outlet && s.title && s.date, `source ${i + 1}: needs outlet, title, date, https url`));
  // Readers are global: a title in a non-Latin script (Korean, Japanese, Chinese...) is shown as an English translation.
  // `title` keeps the original for fact-checking; `title_en` and `language` are what readers see. From 2026-10-23.
  if ((post.date || post.id || "") >= "2026-10-23") {
    src.forEach((s, i) => {
      if (!NON_LATIN.test(s.title || "")) return;
      req(s.title_en && !NON_LATIN.test(s.title_en) && s.language, `source ${i + 1}: title is not in English; add title_en (faithful translation) and language (e.g. "Korean")`);
      for (const [name, text] of [["caption", post.caption], ["threads_caption", post.threads_caption]]) {
        req(!(text || "").includes(s.title), `${name} shows source ${i + 1}'s original title; use title_en with "(in ${s.language || "Korean"})"`);
      }
    });
  }
  req(typeof post.caption === "string" && post.caption.length <= 2200, "caption missing or over 2200 chars");
  req(/source/i.test(post.caption || ""), "caption must credit the source");
  if (post.threads_caption !== undefined) {
    const tc = post.threads_caption;
    const bytes = Buffer.byteLength(String(tc), "utf8");
    req(typeof tc === "string" && tc.trim().length > 0 && bytes <= 500, `threads_caption missing or ${bytes} bytes (max 500)`);
    req(/source/i.test(tc || ""), "threads_caption must credit the source");
    req(!/https?:\/\//i.test(tc || ""), "threads_caption must not contain links");
  }
  const tags = post.hashtags || [];
  req(tags.length >= 3 && tags.length <= 15 && tags.every(t => /^#[A-Za-z0-9_]+$/.test(t)), "3-15 hashtags, each like #AINews");
  // reach rules (added 2026-10-22): a new account can't rank in huge tags, and search reads caption words.
  // Only for posts dated from 2026-10-22, so posts already merged as ready still pass.
  if ((post.date || post.id || "") >= "2026-10-22") {
    req(tags.length <= 5, `${tags.length} hashtags (max 5 from 2026-10-22)`);
    const broad = tags.filter(t => BROAD_TAGS.includes(t.toLowerCase()));
    req(broad.length <= 1, `at most one broad hashtag (${broad.join(" ")}); use story-specific tags like #DeepSeek`);
    const first = (post.caption || "").split("\n")[0].toLowerCase();
    const named = tags.filter(t => !BROAD_TAGS.includes(t.toLowerCase())).some(t => first.includes(t.slice(1).toLowerCase()));
    req(named, "caption's first line must name the story's subject: include a word from a specific hashtag (e.g. DeepSeek for #DeepSeek)");
  }

  // hook floor (PRD 2026-11-01, Jamie chose 45): drop clearly weak cover options (no number, no name, nothing at stake)
  // before hook-judge sees them. A floor only: it does not pick the best hook. From 2026-11-02.
  if ((post.date || post.id || "") >= "2026-11-02") {
    for (const r of scorePost(post)) req(r.pass,
      `hook option ${r.option} "${r.hook}" scores ${r.score} (< ${FLOOR}); weakest ${r.weakest}: ${r.checks[r.weakest].detail}. Rewrite or replace it (scripts/hookscore.mjs)`);
  }

  if (weekly) lintWeekly(post, req);
  return e;
}

// Each story slide must be its post's reviewed words, unchanged: headline as title, caption's first line as body.
function lintWeekly(post, req) {
  const slides = post.slides || [];
  const src = post.sources || [];
  const caption = post.caption || "";
  const originals = slides.map((s, i) => {
    const n = `story ${i + 1}`;
    const file = join(POSTS, s.from || "", "post.json");
    if (!s.from || !existsSync(file)) { req(false, `${n}: from "${s.from}" is not a post in posts/`); return null; }
    const o = JSON.parse(readFileSync(file, "utf8"));
    req(o.status === "published" && o.kind !== "weekly", `${n}: ${s.from} must be a published single post`);
    req(s.kicker === `Story ${i + 1}`, `${n}: kicker must be "Story ${i + 1}"`);
    req(s.tag === o.cover?.tag, `${n}: tag must be ${s.from}'s cover.tag "${o.cover?.tag}"`);
    req(s.title === (o.cover?.headline || []).join(" "), `${n}: title must be ${s.from}'s cover.headline, unchanged`);
    req(JSON.stringify(s.body) === JSON.stringify([parts(o).hook]), `${n}: body must be ${s.from}'s caption first line, unchanged`);
    req(!s.quote, `${n}: no quote slides in a weekly`);
    const idx = s.sources || [];
    req(idx.length >= 1 && idx.length <= 2 && idx.every(k => Number.isInteger(k) && src[k]), `${n}: needs 1-2 valid source indexes`);
    req(idx.every(k => (o.sources || []).some(x => x.url === src[k]?.url && x.title === src[k]?.title && x.outlet === src[k]?.outlet)),
      `${n}: its sources must be ${s.from}'s own sources`);
    return o;
  });
  const lead = originals[0];
  if (lead) {
    req(caption.split("\n")[0] === `This week in AI: ${parts(lead).hook}`, 'caption first line must be "This week in AI: " + story 1\'s caption first line');
    req(JSON.stringify(post.facts) === JSON.stringify(lead.facts), "facts must be story 1's facts, unchanged (they back the cover)");
  }
  req(new Set(slides.map(s => s.from)).size === slides.length, "the same post is in the roundup twice");
  src.forEach((s, i) => req(caption.includes(s.outlet) && caption.includes(s.title_en || s.title), `caption must list source ${i + 1} (${s.outlet}) with its title`));
}

let bad = 0;
for (const d of process.argv.slice(2)) {
  const post = JSON.parse(readFileSync(join(resolve(d), "post.json"), "utf8"));
  const errs = lint(post);
  if (errs.length) { bad++; console.error(`FAIL ${post.id}\n  - ${errs.join("\n  - ")}`); }
  else console.log(`ok   ${post.id}`);
}
process.exit(bad ? 1 : 0);
