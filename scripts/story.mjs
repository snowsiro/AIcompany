// Render a 1080x1920 Story image from a post's rendered cover slide (PRD 2026-11-01, story auto-post).
// Usage: node scripts/story.mjs posts/<id> [...]   writes posts/<id>/story.jpg (needs slides/01.jpg first)
// No new image and no credits: the cover slide sits on a blurred copy of itself, with "New post / Tap our profile"
// underneath, because the API can't add a link sticker.
import { chromium } from "playwright";
import { existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const template = pathToFileURL(join(root, "templates", "story.html")).href;
const dirs = process.argv.slice(2).filter(d => existsSync(join(d, "slides", "01.jpg")));
if (!dirs.length) { console.log("story: no rendered covers"); process.exit(0); }

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
for (const d of dirs) {
  const dir = resolve(d);
  const cover = pathToFileURL(join(dir, "slides", "01.jpg")).href;
  await page.goto(template);
  await page.evaluate(c => window.renderStory(c), cover);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => [...document.querySelectorAll("#card")].every(el => {
    const img = new Image(); img.src = getComputedStyle(el).backgroundImage.slice(5, -2); return img.complete;
  }));
  await page.screenshot({ path: join(dir, "story.jpg"), type: "jpeg", quality: 90 });
  console.log(`story ${dir.split("/").pop()}`);
}
await browser.close();
