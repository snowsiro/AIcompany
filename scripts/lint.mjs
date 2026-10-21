// Rule checker for posts/<id>/post.json. Deterministic, no AI.
// Usage: node scripts/lint.mjs posts/<id> [...]
// New rules must pass on every post in posts/_golden/ before they are enforced (the "original pass test").
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const CATEGORIES = ["POLICY", "INDUSTRY", "ECONOMY", "TOOLS", "RESEARCH", "STARTUPS"];
const HOOK_TYPES = ["number", "claim", "myth-flip", "rivalry", "quote", "reader-impact"];
const REGIONS = ["GLOBAL", "US", "CHINA", "KOREA", "JAPAN", "EUROPE", "ASIA", "MIDEAST", "INDIA"];
const words = s => String(s).replace(/\*\*/g, "").trim().split(/\s+/).filter(Boolean).length;
const plain = s => String(s).replace(/\*\*/g, "");
const emphCount = s => (String(s).match(/\*\*(.+?)\*\*/g) || []).length;
const numbers = s => (plain(s).match(/\d[\d,.]*/g) || []).map(n => n.replace(/[.,]$/, ""));

function lint(post) {
  const e = [];
  const req = (cond, msg) => { if (!cond) e.push(msg); };

  req(/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+$/.test(post.id || ""), "id must look like 2026-10-21-short-slug");
  req(CATEGORIES.includes(post.category), `category must be one of ${CATEGORIES.join(", ")}`);

  // cover
  const c = post.cover || {};
  req(REGIONS.some(r => c.tag === `${r} AI · ${post.category}`), `cover.tag must be "<REGION> AI · ${post.category}", REGION one of ${REGIONS.join(", ")}`);
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
    req(Array.isArray(types) && types.includes("reader-impact"), "cover.hook_options needs at least one reader-impact hook");
    const pick = (c.hook_options || []).findIndex(h => JSON.stringify(h) === JSON.stringify(c.headline));
    req(Array.isArray(types) && c.hook_type === types[pick], "cover.hook_type must be the type of the chosen headline");
  }
  req(typeof c.image_prompt === "string" && /no text/i.test(c.image_prompt) && /no people|no real people/i.test(c.image_prompt),
    "cover.image_prompt must say 'no text' and 'no people'");

  // body slides
  const slides = post.slides || [];
  req(slides.length >= 4 && slides.length <= 6, `need 4-6 body slides (have ${slides.length})`);
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
  const shown = [...(c.headline || []), ...slides.flatMap(s => [s.title || "", ...(s.body || []), s.quote || ""])];
  for (const n of new Set(shown.flatMap(numbers))) {
    req(factText.includes(n), `number "${n}" is not backed by any fact`);
  }

  // sources, caption
  const src = post.sources || [];
  req(src.length >= 1 && src.length <= 3, "need 1-3 sources");
  src.forEach((s, i) => req(/^https:\/\//.test(s.url || "") && s.outlet && s.title && s.date, `source ${i + 1}: needs outlet, title, date, https url`));
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

  return e;
}

let bad = 0;
for (const d of process.argv.slice(2)) {
  const post = JSON.parse(readFileSync(join(resolve(d), "post.json"), "utf8"));
  const errs = lint(post);
  if (errs.length) { bad++; console.error(`FAIL ${post.id}\n  - ${errs.join("\n  - ")}`); }
  else console.log(`ok   ${post.id}`);
}
process.exit(bad ? 1 : 0);
