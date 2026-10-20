// List new AI articles from the outlets in config/sources.yaml, for the researcher.
// Usage: node scripts/feeds.mjs <out.json> [hours]
//
// Runs in GitHub Actions before the morning routine: some outlets refuse the routine's fetches,
// but their RSS feeds (or Google News RSS for that site) still say what was published.
// Only titles, links and dates are kept. The researcher still has to read the original article.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

const [out, hoursArg] = process.argv.slice(2);
if (!out) {
  console.error("usage: node scripts/feeds.mjs <out.json> [hours]");
  process.exit(2);
}
const hours = Number(hoursArg || 36);
const since = Date.now() - hours * 36e5;

// "AI" alone would match "said", so it is matched as a whole word.
const AI_WORDS = /\bAI\b|\bA\.I\.|artificial intelligence|\bKI\b|künstliche intelligenz|인공지능|\bLLMs?\b|chatbot|machine learning|OpenAI|ChatGPT|Anthropic|Claude|Gemini|DeepMind|DeepSeek|Mistral|Copilot|Nvidia|GPU|생성형|챗봇|딥러닝/i;

function sources() {
  const yaml = readFileSync("config/sources.yaml", "utf8");
  const block = yaml.split(/^news_sources:/m)[1].split(/\n\S/)[0];
  const list = [];
  let group = null;
  for (const line of block.split("\n")) {
    let m;
    if ((m = line.match(/^ {2}(\w+):\s*$/))) group = m[1];
    else if ((m = line.match(/^\s+- name:\s*(.+)$/))) list.push({ group, name: m[1].trim() });
    else if ((m = line.match(/^\s+(url|rss|lang):\s*(\S+)/)) && list.length) list.at(-1)[m[1]] = m[2];
  }
  return list;
}

function googleNews(src) {
  const host = new URL(src.url).hostname.replace(/^www\./, "");
  const ko = src.lang === "ko";
  const q = `site:${host} ${ko ? "AI OR 인공지능" : 'AI OR "artificial intelligence"'} when:${Math.ceil(hours / 24)}d`;
  const loc = ko ? "hl=ko&gl=KR&ceid=KR:ko" : "hl=en-US&gl=US&ceid=US:en";
  return `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&${loc}`;
}

function text(s = "") {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    .replace(/\s+/g, " ").trim();
}

// RSS 2.0 <item> and Atom <entry>, without a parser dependency.
function parse(xml) {
  const tag = (block, name) => block.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`))?.[1];
  return [...xml.matchAll(/<(item|entry)[\s>][\s\S]*?<\/\1>/g)].map(([block]) => ({
    title: text(tag(block, "title")),
    link: text(tag(block, "link")) || block.match(/<link[^>]*href="([^"]+)"/)?.[1] || "",
    published: text(tag(block, "pubDate") || tag(block, "published") || tag(block, "updated") || tag(block, "dc:date")),
  }));
}

async function fetchFeed(url) {
  const res = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0 (compatible; ai-news-company-feeds/1.0; +https://github.com/snowsiro/AIcompany)" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const items = parse(await res.text());
  if (!items.length) throw new Error("no items");
  return items;
}

const results = [];
for (const src of sources()) {
  const tries = [src.rss && ["rss", src.rss], ["google_news", googleNews(src)]].filter(Boolean);
  const entry = { group: src.group, source: src.name, ok: false, via: null, items: [] };
  const errors = [];
  for (const [via, url] of tries) {
    try {
      const items = await fetchFeed(url);
      // Newsrooms and AI-section feeds are on topic already; the rest must mention AI in the title.
      const onTopic = via === "google_news" || src.group === "company_newsrooms" || /\/ai\b|artificial/i.test(src.rss || "");
      entry.items = items
        .filter(i => i.title && Date.parse(i.published) >= since)
        .filter(i => onTopic || AI_WORDS.test(i.title))
        .slice(0, 15);
      entry.ok = true;
      entry.via = via;
      break;
    } catch (err) {
      errors.push(`${via}: ${err.message}`);
    }
  }
  if (errors.length) entry.errors = errors;
  results.push(entry);
  console.log(`${entry.ok ? "ok  " : "fail"} ${src.name.padEnd(40)} ${entry.via ?? "-"} ${entry.items.length} items${errors.length ? `  (${errors.join("; ")})` : ""}`);
}

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, JSON.stringify({ fetched_at: new Date().toISOString(), hours, sources: results }, null, 1) + "\n");
const ok = results.filter(r => r.ok).length;
console.log(`sources read: ${ok}/${results.length}, items: ${results.reduce((n, r) => n + r.items.length, 0)} -> ${out}`);
if (ok === 0) process.exit(1);
