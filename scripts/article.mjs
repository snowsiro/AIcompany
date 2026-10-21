// Print an article's own text, so names, numbers and quotes can be checked word for word.
// Usage: node scripts/article.mjs <url>
//
// WebFetch hands back a model's summary of a page, which is not enough to confirm an exact quote or figure.
// This fetches the page itself and prints its title, date and paragraphs. Nothing is saved.
// Exits 1 when the site refuses the fetch or the page has no readable text (some sites need JavaScript).
const [url] = process.argv.slice(2);
if (!url) {
  console.error("usage: node scripts/article.mjs <url>");
  process.exit(2);
}

const NAMED = { ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’", mdash: "—", ndash: "–", hellip: "…", nbsp: " ", euro: "€", pound: "£", yen: "¥" };

function text(s = "") {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&([a-z]+);/g, (m, n) => NAMED[n] ?? m).replace(/&amp;/g, "&")
    .replace(/\s+/g, " ").trim();
}

const meta = (html, key) =>
  html.match(new RegExp(`<meta[^>]+(?:property|name|itemprop)=["']${key}["'][^>]*content=["']([^"']*)`, "i"))?.[1] ||
  html.match(new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*(?:property|name|itemprop)=["']${key}["']`, "i"))?.[1];

// News sites often carry the full text in their JSON-LD block as articleBody.
function jsonLd(html) {
  const found = [];
  for (const [, raw] of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const walk = o => {
        if (Array.isArray(o)) return o.forEach(walk);
        if (!o || typeof o !== "object") return;
        if (o.articleBody || o.datePublished) found.push(o);
        if (o["@graph"]) walk(o["@graph"]);
      };
      walk(JSON.parse(raw));
    } catch {}
  }
  return found;
}

function blocks(html) {
  return [...html.matchAll(/<(p|h2|h3|li|blockquote)[\s>][\s\S]*?<\/\1>/gi)]
    .map(([block, tag]) => (tag.toLowerCase().startsWith("h") ? "## " : "") + text(block))
    .filter(p => p.replace(/^## /, "").length > 1);
}

// The story is the <article> with the most text; other <article>s on the page are usually teasers for related stories.
function paragraphs(html) {
  const clean = html.replace(/<(script|style|noscript|svg|figure|aside|nav|footer|form)[\s>][\s\S]*?<\/\1>/gi, "");
  const size = list => list.join(" ").length;
  const articles = [...clean.matchAll(/<article[\s>][\s\S]*?<\/article>/gi)].map(([a]) => blocks(a));
  const best = articles.sort((a, b) => size(b) - size(a))[0];
  return best && size(best) >= 300 ? best : blocks(clean);
}

try {
  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36",
      "accept": "text/html,application/xhtml+xml",
      "accept-language": "en-US,en;q=0.9,ko;q=0.8,de;q=0.7",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  const ld = jsonLd(html);
  const title = text(meta(html, "og:title") || html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
  const published = meta(html, "article:published_time") || ld.find(o => o.datePublished)?.datePublished || "";
  const fromPage = paragraphs(html);
  const fromLd = text(ld.find(o => o.articleBody)?.articleBody || "");
  const body = fromLd.length > fromPage.join(" ").length ? [fromLd] : fromPage;
  if (body.join(" ").length < 300) throw new Error("no article text on the page (it may need JavaScript, or a paywall)");
  console.log(`url: ${res.url}\ntitle: ${title}\npublished: ${published}\n\n${body.join("\n\n")}`);
} catch (err) {
  console.error(`FAIL ${url}: ${err.message}`);
  process.exit(1);
}
