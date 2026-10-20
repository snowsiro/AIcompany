// Render posts/<id>/post.json into 1080x1350 JPEG slides (Instagram's publishing API only accepts JPEG).
// Usage: node scripts/render.mjs posts/<id> [posts/<id> ...]
// Exits non-zero if any slide fails the fit check, so the pipeline can send it back to the writer.
import { chromium } from "playwright";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const template = pathToFileURL(join(root, "templates", "card.html")).href;
const dirs = process.argv.slice(2);
if (dirs.length === 0) {
  console.error("usage: node scripts/render.mjs posts/<id> [...]");
  process.exit(2);
}

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}
);
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
let failed = 0;

for (const d of dirs) {
  const dir = resolve(d);
  const post = JSON.parse(readFileSync(join(dir, "post.json"), "utf8"));
  let coverFile = ["cover.jpg", "cover.png", "cover.webp"].map(f => join(dir, f)).find(existsSync);
  if (!coverFile && post.cover.image_url) {
    try {
      const res = await fetch(post.cover.image_url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      coverFile = join(dir, "cover.png");
      writeFileSync(coverFile, Buffer.from(await res.arrayBuffer()));
    } catch (err) {
      console.warn(`warn ${post.id}: could not download cover image (${err.message}); using fallback background`);
      if (process.env.REQUIRE_COVER) failed++;
    }
  }
  const coverUrl = coverFile ? pathToFileURL(coverFile).href : null;
  const out = join(dir, "slides");
  mkdirSync(out, { recursive: true });
  const total = post.slides.length + 2;

  for (let i = 0; i < total; i++) {
    await page.goto(template);
    await page.evaluate(([p, i, c]) => window.renderCard(p, i, c), [post, i, coverUrl]);
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => { if (document.querySelector(".cover h1")) window.fitCover(); });
    if (coverUrl && i === 0) await page.waitForFunction(() => {
      const bg = document.querySelector(".bg");
      if (!bg) return true;
      const img = new Image();
      img.src = getComputedStyle(bg).backgroundImage.slice(5, -2);
      return img.complete;
    });
    const problems = await page.evaluate(() => window.checkFit());
    const name = `${String(i + 1).padStart(2, "0")}.jpg`;
    await page.screenshot({ path: join(out, name), type: "jpeg", quality: 92 });
    if (problems.length) {
      failed++;
      console.error(`FAIL ${post.id} slide ${i + 1}: ${problems.join("; ")}`);
    } else {
      console.log(`ok   ${post.id} slide ${i + 1} -> ${join(d, "slides", name)}`);
    }
  }
}

await browser.close();
process.exit(failed ? 1 : 0);
