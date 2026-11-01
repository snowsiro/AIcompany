// Hook pre-filter for cover.hook_options. Deterministic, no AI, no network.
// Usage: node scripts/hookscore.mjs posts/<id> [...]        score each option, mark the ones under the floor
//        node scripts/hookscore.mjs --json posts/<id> [...]
//
// Ported from hookscore.py in github.com/Jakeschincariol/instagram-agent-skill (MIT, (c) Jake Schincariol).
// Five checks, each 0-100: LENGTH, SPECIFICITY, STAKES, FRONTLOAD, ADDRESS; the weakest caps the total.
// Its author measured it on real Reel hooks: it separates bad hooks from real ones well (AUC 0.83) but
// barely ranks two decent hooks (AUC 0.56). So it is a floor, never a judge: hook-judge still decides.
//
// Changes for our covers (two ALL-CAPS lines, max 16 chars each, on screen, not spoken):
// - names are found from the post's own caption and slides (mixed case), since caps hide proper nouns;
// - "**" emphasis markers are removed before scoring.

import { readFileSync } from "node:fs";
import { join } from "node:path";

export const FLOOR = 50;

const NUMBER_RE = /\$\s?\d[\d,]*(?:\.\d+)?[KMBT]?|\b\d[\d,]*(?:\.\d+)?\s?(?:%|k\b|x\b|hrs?\b|hours?\b|mins?\b|minutes?\b|days?\b|weeks?\b|months?\b|years?\b|[MBT]\b)?|[₩€£¥]\s?\d[\d,.]*[KMBT]?/gi;
const WORD_RE = /[A-Za-z0-9$₩€£¥%'’-]+/g;
const HASHTAG_RE = /(?:^|\s)#\w+/;
const EMOJI_RE = /[\u{1F300}-\u{1FAFF}☀-➿]/u;

const SPOKEN_NUMBERS = new Set(["zero", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven",
  "twelve", "fifteen", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety", "hundred",
  "thousand", "million", "billion", "dozen", "half", "twice", "triple"]);
const MONEY_WORDS = new Set(["dollars", "dollar", "bucks", "grand", "percent", "cents", "millionaire", "billionaire",
  "revenue", "profit", "salary", "rent"]);
const STAKES = new Set(["stop", "never", "wrong", "mistake", "mistakes", "lost", "lose", "losing", "cost", "costs", "broke",
  "broken", "failed", "failure", "fail", "nobody", "no", "not", "don't", "dont", "doesn't", "didn't", "can't", "won't",
  "quit", "quitting", "fired", "deleted", "delete", "killed", "kills", "kill", "replaced", "replaces", "cut", "beat",
  "free", "paid", "charged", "hired", "saved", "first", "banned", "illegal", "worst", "hate", "hated", "wasted", "waste",
  "scam", "lie", "lied", "lying", "truth", "secret", "hidden", "stole", "stolen", "before", "until", "instead", "but",
  "except", "unless", "problem", "risk", "danger", "warning", "regret", "wish", "should", "shouldn't", "still",
  "already", "only", "without", "versus", "vs", "actually"]);
const WEAK_OPENERS = ["so", "ok", "okay", "hey", "hi", "hello", "guys", "yo", "alright", "welcome", "today", "basically",
  "honestly", "look", "listen", "um", "just", "let", "lets", "let's", "i wanted", "i want", "one of", "have you",
  "did you", "do you", "are you", "in this", "in today", "the thing", "a lot", "there is", "there are", "this is",
  "it is", "as a", "when it", "if you've", "you know"];
const IMPERATIVES = new Set(["stop", "steal", "copy", "delete", "try", "watch", "read", "save", "use", "build", "make",
  "write", "send", "take", "start", "quit", "never", "always", "don't", "dont", "do", "put", "run", "check"]);
const DEALBREAKERS = [
  [/^\s*(?:stop scrolling|don'?t scroll)/i, 'opens with "stop scrolling"'],
  [/\b(?:in (?:this|today'?s) (?:video|reel|post)|i'?m going to show you|i'?ll show you how)\b/i, "preamble"],
  [/^\s*(?:hey |hi |what'?s up |welcome )/i, "greeting"],
  [HASHTAG_RE, "hashtag in the hook"],
  [EMOJI_RE, "emoji in the hook"],
];

const clamp = n => Math.max(0, Math.min(100, n));
const words = t => t.replace(/(?<=\d),(?=\d)/g, "").match(WORD_RE) || [];
const norm = w => w.toLowerCase().replace(/['’]s$/, "").replace(/^['’]+|['’]+$/g, "");
const isNumber = w => new RegExp(`^(?:${NUMBER_RE.source})$`, "i").test(w) || /\d/.test(w);

// Names: capitalized words in the post's own prose that are not just sentence starts.
export function namesFrom(post) {
  const text = [post.caption, ...(post.slides || []).flatMap(s => Object.values(s).filter(v => typeof v === "string"))]
    .filter(Boolean).join(" ").replace(/\*\*/g, "");
  const names = new Set();
  for (const m of text.matchAll(/(?<![.!?:]\s|^)\b([A-Z][A-Za-z0-9]{1,}|[A-Z]{2,}[a-z]*)\b/gm)) {
    const w = m[1].toLowerCase();
    if (!["the", "a", "an", "it", "its", "this", "that", "and", "but", "for", "in", "on", "i", "we", "you"].includes(w)) names.add(w);
  }
  return names;
}

function checkLength(t) {
  const n = words(t).length, chars = t.trim().length;
  let s = n >= 5 && n <= 12 ? 100 : n < 5 ? 100 - (5 - n) * 20 : 100 - (n - 12) * 11;
  if (chars > 60) s -= 12;
  return [clamp(s), `${n} words, ${chars} chars (want 5-12 words)`];
}
function checkSpecificity(t, names) {
  const nums = (t.match(NUMBER_RE) || []).map(x => x.trim()).filter(Boolean);
  const low = words(t).map(norm);
  const named = [...new Set(low.filter(w => names.has(w)))];
  const spoken = low.filter(w => SPOKEN_NUMBERS.has(w) || MONEY_WORDS.has(w));
  const hits = nums.length + named.length + spoken.length;
  const found = [...nums.slice(0, 2), ...named.slice(0, 2), ...spoken.slice(0, 2)].join(", ");
  return [hits ? clamp(45 + hits * 30) : 15, `${hits} concrete marker(s)${found ? ": " + found : " - no number, no name"}`];
}
function checkStakes(t) {
  const markers = [...new Set(words(t).map(norm).filter(w => STAKES.has(w)))].sort();
  if (/[$₩€£¥]\s?\d/.test(t)) markers.push("a price");
  const n = markers.length;
  return [n === 0 ? 20 : n === 1 ? 70 : 100, `${n} tension marker(s)${n ? ": " + markers.slice(0, 4).join(", ") : ""}`];
}
function checkFrontload(t, names) {
  const w = words(t);
  if (!w.length) return [0, "empty"];
  const low = w.map(norm), opener = low.slice(0, 2).join(" ");
  const weak = WEAK_OPENERS.find(x => opener.startsWith(x) || low[0] === x);
  const i = low.findIndex((x, k) => STAKES.has(x) || SPOKEN_NUMBERS.has(x) || MONEY_WORDS.has(x) || isNumber(w[k]) || names.has(x));
  const base = i < 0 ? 30 : i <= 3 ? 100 : i <= 6 ? 70 : 40;
  const where = i < 0 ? "no payload word" : `payload at word ${i + 1}`;
  return [clamp(base - (weak ? 30 : 0)), where + (weak ? `; weak opener "${weak}"` : "")];
}
function checkAddress(t) {
  const low = t.toLowerCase(), first = norm(words(t)[0] || "");
  if (/\b(you|your|you're|youre|yourself)\b/.test(low)) return [100, "speaks to the reader"];
  if (IMPERATIVES.has(first)) return [90, `imperative opener ("${first}")`];
  if (/\b(i|my|me|we|our)\b/.test(low)) return [70, "first person"];
  return [35, "third person"];
}

const CHECKS = ["LENGTH", "SPECIFICITY", "STAKES", "FRONTLOAD", "ADDRESS"];

export function scoreHook(lines, names = new Set()) {
  const t = (Array.isArray(lines) ? lines.join(" ") : String(lines)).replace(/\*\*/g, "");
  const r = { LENGTH: checkLength(t), SPECIFICITY: checkSpecificity(t, names), STAKES: checkStakes(t),
    FRONTLOAD: checkFrontload(t, names), ADDRESS: checkAddress(t) };
  const flags = DEALBREAKERS.filter(([re]) => re.test(t)).map(([, m]) => m);
  const s = CHECKS.map(c => r[c][0]);
  const mean = s.reduce((a, b) => a + b, 0) / s.length;
  const score = Math.round(clamp(mean * 0.6 + Math.min(...s) * 0.4 - flags.length * 15) * 10) / 10;
  const weakest = CHECKS.reduce((a, c) => (r[c][0] < r[a][0] ? c : a));
  return { hook: t, score, pass: score >= FLOOR, weakest, flags,
    checks: Object.fromEntries(CHECKS.map(c => [c, { score: r[c][0], detail: r[c][1] }])) };
}

export function scorePost(post) {
  const names = namesFrom(post);
  return (post.cover?.hook_options || []).map((h, i) => ({ option: i, ...scoreHook(h, names) }));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2), json = args.includes("--json");
  const dirs = args.filter(a => a !== "--json");
  if (!dirs.length) { console.error("usage: node scripts/hookscore.mjs [--json] posts/<id> [...]"); process.exit(2); }
  const out = {};
  for (const d of dirs) {
    const post = JSON.parse(readFileSync(join(d, "post.json"), "utf8"));
    out[post.id] = scorePost(post);
    if (json) continue;
    console.log(`\n${post.id}`);
    for (const r of out[post.id])
      console.log(`  ${r.pass ? "  " : "x "}${String(r.score).padStart(5)}  [${r.option}] ${r.hook}   (weakest ${r.weakest} ${r.checks[r.weakest].score}${r.flags.length ? "; " + r.flags.join(", ") : ""})`);
  }
  if (json) console.log(JSON.stringify(out, null, 1));
}
