// Builds the Sunday roundup "This week in AI" from our own posts of the past Monday to Saturday (PRD 2026-10-26).
// Deterministic, no AI: every item is copied from a published post that already passed the three reviews.
// The only new words are the cover hooks, which the writer adds afterwards (they go through the reviews as usual).
// Usage: node scripts/weekly.mjs <sunday YYYY-MM-DD> [--lead <post id>] [--out <folder>]
//   writes <out or posts>/<sunday>-weekly/post.json with "status": "draft"
//
// Picks up to 7 posts by reach (carousel + Reel) in the newest ops/metrics/*.json, newest first on ties or without metrics.
// --lead puts the writer's chosen story first; the cover image, image prompt and facts come from that post.
// Running it again with the same lead keeps the cover hooks the writer already wrote.
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parts } from "./caption.mjs";

const root = resolve(import.meta.dirname, "..");
const POSTS = join(root, "posts");
const MAX = 7, MIN = 3, CAPTION_MAX = 2200;
const BROAD_TAGS = ["#ainews", "#ai", "#artificialintelligence", "#technews", "#tech", "#technology", "#machinelearning",
  "#innovation", "#future", "#news", "#chatgpt", "#genai", "#generativeai"];
const NON_LATIN = /[\p{Script=Hangul}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Cyrillic}\p{Script=Arabic}\p{Script=Hebrew}\p{Script=Thai}\p{Script=Devanagari}\p{Script=Greek}]/u;
const FOLLOW = "Follow @ai.news.company for daily AI news. Weekly digest: link in bio.";

const args = process.argv.slice(2);
const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const sunday = args[0];
if (!/^\d{4}-\d{2}-\d{2}$/.test(sunday || "") || new Date(`${sunday}T12:00:00Z`).getUTCDay() !== 0) {
  console.error("usage: node scripts/weekly.mjs <sunday YYYY-MM-DD> [--lead <post id>] [--out <folder>]");
  process.exit(2);
}
const day = n => new Date(Date.parse(`${sunday}T12:00:00Z`) + n * 864e5).toISOString().slice(0, 10);
const monday = day(-6), saturday = day(-1);

const week = readdirSync(POSTS)
  .filter(d => /^\d{4}-\d{2}-\d{2}-/.test(d) && existsSync(join(POSTS, d, "post.json")))
  .map(d => JSON.parse(readFileSync(join(POSTS, d, "post.json"), "utf8")))
  .filter(p => p.kind !== "weekly" && p.status === "published" && p.date >= monday && p.date <= saturday)
  // Readers only see English source titles. Posts from before 2026-10-23 may lack title_en; leave those out (no AI here to translate).
  .filter(p => {
    const bad = (p.sources || []).find(s => NON_LATIN.test(s.title || "") && !s.title_en);
    if (bad) console.warn(`left out ${p.id}: source "${bad.outlet}" has no title_en`);
    return !bad;
  });

// reach per post from the newest metrics file up to that Sunday (Meta settles numbers over 48h, the newest file wins)
const metricsDir = join(root, "ops", "metrics");
const metricsFile = existsSync(metricsDir) && readdirSync(metricsDir).filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f) && f.slice(0, 10) <= sunday).sort().pop();
const reach = {};
if (metricsFile) {
  for (const m of JSON.parse(readFileSync(join(metricsDir, metricsFile), "utf8")).posts || []) {
    if (m.post && Number.isFinite(m.reach)) reach[m.post] = (reach[m.post] || 0) + m.reach;
  }
}
const newest = (a, b) => (a.date !== b.date ? (a.date < b.date ? 1 : -1) : b.id.localeCompare(a.id));
week.sort((a, b) => (reach[b.id] ?? -1) - (reach[a.id] ?? -1) || newest(a, b));

const lead = opt("--lead");
if (lead) {
  const i = week.findIndex(p => p.id === lead);
  if (i < 0) { console.error(`--lead ${lead}: not a published post from ${monday} to ${saturday}`); process.exit(1); }
  week.unshift(...week.splice(i, 1));
}
if (week.length < MIN) {
  console.error(`skip: only ${week.length} published posts from ${monday} to ${saturday} (need ${MIN}); no roundup this week`);
  process.exit(1);
}

const srcTitle = s => (s.title_en ? `"${s.title_en}" (in ${s.language || "Korean"})` : `"${s.title}"`);

function build(picked) {
  const first = picked[0];
  // Sources: the lead's come first and in order, so its facts keep pointing at the right source index.
  const sources = [];
  const indexOf = s => {
    let i = sources.findIndex(x => x.url === s.url);
    if (i < 0) { sources.push(s); i = sources.length - 1; }
    return i;
  };
  const all = picked.map(p => (p.sources || []).map(indexOf));
  const slides = picked.map((p, n) => ({
    kicker: `Story ${n + 1}`,
    from: p.id,
    tag: p.cover.tag,
    title: p.cover.headline.join(" "),
    body: [parts(p).hook],
    sources: all[n].slice(0, 2),
  }));

  const caption = [
    `This week in AI: ${parts(first).hook}`,
    picked.slice(1).map(p => `→ ${parts(p).hook}`).join("\n"),
    "Sources:\n" + picked.map((p, n) => `${n + 1}. ${all[n].map(i => `${sources[i].outlet}, ${srcTitle(sources[i])}`).join("; ")}`).join("\n"),
    FOLLOW,
  ].join("\n\n");

  // #AINews + the lead's tags named in the first line (lint needs one) + one specific tag per other story, max 5
  const specific = p => (p.hashtags || []).filter(t => !BROAD_TAGS.includes(t.toLowerCase()));
  const firstLine = caption.split("\n")[0].toLowerCase();
  const leadTags = specific(first).sort((a, b) => firstLine.includes(b.slice(1).toLowerCase()) - firstLine.includes(a.slice(1).toLowerCase()));
  const tags = ["#AINews"];
  const add = t => { if (t && tags.length < 5 && !tags.some(x => x.toLowerCase() === t.toLowerCase())) tags.push(t); };
  add(leadTags[0]);
  for (const p of picked.slice(1)) add(specific(p).find(t => !tags.some(x => x.toLowerCase() === t.toLowerCase())));
  for (const t of leadTags.slice(1)) add(t);

  return { sources, slides, caption, hashtags: tags };
}

// Over the caption limit: drop the lowest-ranked story until it fits (7 → 6 → 5 ...).
let picked = week.slice(0, MAX), built = build(picked);
while (built.caption.length > CAPTION_MAX && picked.length > MIN) { picked = picked.slice(0, -1); built = build(picked); }
if (built.caption.length > CAPTION_MAX) { console.error(`caption is ${built.caption.length} chars even with ${MIN} stories`); process.exit(1); }

const first = picked[0];
const id = `${sunday}-weekly`;
const dir = join(resolve(opt("--out") || POSTS), id);
const file = join(dir, "post.json");
const old = existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : null;
const keep = old?.slides?.[0]?.from === first.id ? old.cover : {};

const post = {
  id,
  date: sunday,
  kind: "weekly",
  category: "WEEKLY",
  status: "draft",
  cover: {
    tag: "GLOBAL AI · WEEKLY",
    headline: keep.headline ?? [],
    hook_options: keep.hook_options ?? [],
    hook_types: keep.hook_types ?? [],
    hook_type: keep.hook_type ?? null,
    ...(keep.hook_pick_reason ? { hook_pick_reason: keep.hook_pick_reason } : {}),
    image_prompt: first.cover.image_prompt,
    image_url: first.cover.image_url,
  },
  slides: built.slides,
  facts: first.facts,
  sources: built.sources,
  caption: built.caption,
  hashtags: built.hashtags,
  threads_caption: `This week in AI: ${picked.length} stories from around the world. Sources on each card.`,
};

mkdirSync(dir, { recursive: true });
writeFileSync(file, JSON.stringify(post, null, 2) + "\n");
const cover = ["cover.jpg", "cover.png", "cover.webp"].find(f => existsSync(join(POSTS, first.id, f)));
if (cover) copyFileSync(join(POSTS, first.id, cover), join(dir, cover));

console.log(`weekly ${id}: ${picked.length} stories (${monday} to ${saturday}), lead ${first.id}, caption ${built.caption.length} chars` +
  `${metricsFile ? `, ranked by reach in ops/metrics/${metricsFile}` : ", no metrics: newest first"}`);
picked.forEach((p, n) => console.log(`  ${n + 1}. ${p.id}${reach[p.id] !== undefined ? ` (reach ${reach[p.id]})` : ""}`));
if (!post.cover.headline.length) console.log(`next: writer adds cover.hook_options/headline/hook_types/hook_type, then lint + render ${dir}`);
