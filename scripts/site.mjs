// Builds the link-in-bio site and the weekly newsletter digest into _site/ (deployed by .github/workflows/site.yml).
// Deterministic, no AI: every sentence comes from a published post's caption, which already passed the three reviews.
// Usage: node scripts/site.mjs [out-dir]
//
//   index.html   link-in-bio page: newsletter button, recent posts with their original sources, "Tools we use" (Ad)
//   digest.html  this week's digest (last 7 days). Open it on Sunday, copy all, paste into the newsletter editor.
import { readFileSync, readdirSync, writeFileSync, mkdirSync, copyFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { parts } from "./caption.mjs";

const OUT = process.argv[2] || "_site";
const site = JSON.parse(readFileSync("config/site.json", "utf8"));
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const safeUrl = u => (/^https:\/\//.test(u || "") ? u : "");
// Non-English sources are shown by their English translation (see writer.md, `title_en`).
const srcTitle = s => (s?.title_en ? `“${esc(s.title_en)}” (in ${esc(s.language || "Korean")})` : `“${esc(s?.title)}”`);

const posts = readdirSync("posts")
  .filter(d => /^\d{4}-\d{2}-\d{2}-/.test(d) && existsSync(join("posts", d, "post.json")))
  .map(d => ({ dir: d, ...JSON.parse(readFileSync(join("posts", d, "post.json"), "utf8")) }))
  // Weekly roundups repeat stories that are already listed, with several sources, so they stay off the page and the digest.
  .filter(p => p.status === "published" && p.permalink && p.kind !== "weekly")
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.dir.localeCompare(a.dir)));

const viennaDate = new Date().toLocaleDateString("en-CA", { timeZone: "Europe/Vienna" });
const weekAgo = new Date(Date.parse(viennaDate) - 6 * 864e5).toISOString().slice(0, 10);
const week = posts.filter(p => p.date >= weekAgo && p.date <= viennaDate);

const css = `
@font-face { font-family: "Inter Tight"; src: url("fonts/InterTight-Variable.woff2") format("woff2"); font-weight: 100 900; }
@font-face { font-family: "Anton"; src: url("fonts/Anton-Regular.woff2") format("woff2"); }
:root { --ink: #0A0A0C; --paper: #F5F5F0; --muted: #9A9AA2; --accent: #FFD23F; --line: #2A2A30; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--ink); color: var(--paper); font: 500 16px/1.5 "Inter Tight", system-ui, sans-serif; }
main { max-width: 560px; margin: 0 auto; padding: 32px 16px 48px; }
h1 { font: 400 40px/0.95 "Anton", sans-serif; text-transform: uppercase; margin: 0 0 8px; }
h2 { font-weight: 800; font-size: 14px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); margin: 36px 0 12px; }
p { margin: 0 0 12px; }
a { color: var(--paper); }
.muted { color: var(--muted); font-size: 14px; }
.btn { display: block; text-align: center; padding: 14px; border-radius: 12px; font-weight: 800; text-decoration: none; margin: 10px 0; }
.btn.primary { background: var(--accent); color: var(--ink); }
.btn.ghost { border: 1px solid var(--line); }
.post { display: grid; grid-template-columns: 88px 1fr; gap: 12px; padding: 12px 0; border-top: 1px solid var(--line); }
.post img { width: 88px; height: 110px; object-fit: cover; border-radius: 8px; display: block; }
.post .hook { font-weight: 800; margin-bottom: 4px; }
.ad { display: inline-block; font-size: 11px; font-weight: 700; border: 1px solid var(--muted); color: var(--muted); border-radius: 999px; padding: 0 6px; margin-left: 6px; }
.tool { padding: 10px 0; border-top: 1px solid var(--line); }
`;

const page = (title, body, extraHead = "") => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>${extraHead}<style>${css}</style></head>
<body><main>${body}</main></body></html>
`;

function toolsHtml() {
  const tools = (site.affiliates || []).filter(t => safeUrl(t.url));
  if (!tools.length) return "";
  return `<h2>Tools we use</h2>
<p class="muted">Links marked Ad are affiliate links: we may earn a commission if you sign up. They never decide what news we cover.</p>
${tools.map(t => `<div class="tool"><a href="${esc(t.url)}" rel="sponsored noopener">${esc(t.name)}</a><span class="ad">Ad</span>${t.note ? `<div class="muted">${esc(t.note)}</div>` : ""}</div>`).join("\n")}`;
}

// index.html
mkdirSync(join(OUT, "covers"), { recursive: true });
mkdirSync(join(OUT, "fonts"), { recursive: true });
for (const f of ["InterTight-Variable.woff2", "Anton-Regular.woff2"]) copyFileSync(join("assets/fonts", f), join(OUT, "fonts", f));
const recent = posts.slice(0, 12);
const items = recent.map(p => {
  const { hook, source } = parts(p);
  const cover = join("posts", p.dir, "slides", "01.jpg");
  let img = "";
  if (existsSync(cover)) { copyFileSync(cover, join(OUT, "covers", `${p.dir}.jpg`)); img = `<img src="covers/${esc(p.dir)}.jpg" alt="" loading="lazy">`; }
  return `<div class="post"><a href="${esc(p.permalink)}">${img}</a><div>
<div class="hook"><a href="${esc(p.permalink)}">${esc(hook)}</a></div>
<div class="muted">${esc(p.date)} · Source: <a href="${esc(safeUrl(source?.url))}" rel="noopener">${esc(source?.outlet)}, ${srcTitle(source)}</a></div>
</div></div>`;
}).join("\n");

const newsletter = safeUrl(site.newsletter_url)
  ? `<a class="btn primary" href="${esc(site.newsletter_url)}">Get the weekly digest by email</a>`
  : "";
writeFileSync(join(OUT, "index.html"), page(site.title, `
<h1>${esc(site.title)}</h1>
<p class="muted">${esc(site.tagline)}</p>
${newsletter}
<a class="btn ghost" href="${esc(site.instagram)}">Instagram</a>
<a class="btn ghost" href="${esc(site.threads)}">Threads</a>
<h2>Latest stories</h2>
${items || `<p class="muted">First stories coming soon.</p>`}
${toolsHtml()}
<p class="muted" style="margin-top:36px">Facts come from the original articles linked above. Images are AI-generated illustrations.</p>
`));

// digest.html: not linked from the page and kept out of search engines; it is a paste source, not a public page.
const fmt = d => new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const digestBody = week.length ? week.slice().reverse().map(p => {
  const { hook, context, bullets, source } = parts(p);
  return `<h3>${esc(hook)}</h3>
${context.map(c => `<p>${esc(c)}</p>`).join("")}
${bullets.length ? `<ul>${bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>` : ""}
<p>Source: <a href="${esc(safeUrl(source?.url))}">${esc(source?.outlet)}, ${srcTitle(source)}</a> · <a href="${esc(p.permalink)}">See the cards</a></p>`;
}).join("\n<hr>\n") : "<p>No stories were published this week.</p>";
const tools = (site.affiliates || []).filter(t => safeUrl(t.url));
const digestTools = tools.length
  ? `<hr><p><strong>Tools we use (Ad)</strong> · affiliate links, we may earn a commission. They never decide what we cover.</p><ul>${tools.map(t => `<li><a href="${esc(t.url)}">${esc(t.name)}</a> (Ad)${t.note ? `: ${esc(t.note)}` : ""}</li>`).join("")}</ul>`
  : "";
writeFileSync(join(OUT, "digest.html"), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<meta name="viewport" content="width=device-width, initial-scale=1"><title>Digest ${esc(weekAgo)} to ${esc(viennaDate)}</title></head>
<body style="max-width:640px;margin:0 auto;padding:24px 16px;font:16px/1.5 system-ui,sans-serif;background:#fff;color:#111">
<p style="background:#FFF6CC;padding:8px 12px;border-radius:8px;font-size:14px">Copy everything below this box and paste it into the newsletter editor. Subject idea: <strong>${esc(week[0] ? parts(week[0]).hook : "This week in AI")}</strong></p>
<h2>This week in AI · ${esc(fmt(weekAgo))} to ${esc(fmt(viennaDate))}</h2>
<p>${week.length} stories from around the world, each checked against the original article.</p>
${digestBody}
${digestTools}
<hr><p>Follow <a href="${esc(site.instagram)}">@ai.news.company</a> for two stories a day.</p>
</body></html>
`);
console.log(`site: ${recent.length} posts on the page, ${week.length} in this week's digest (${weekAgo} to ${viennaDate}) -> ${OUT}/`);
