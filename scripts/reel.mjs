// Turn a post's rendered slides into a 9:16 Reel video (added 2026-10-22). No new images, no credits: ffmpeg only.
// Usage: node scripts/reel.mjs posts/<id> [...]   writes posts/<id>/reel.mp4
//
// Each 4:5 slide sits in the middle of a 1080x1920 frame on the ink background (DESIGN.md).
// The cover shows for 2.5s, body slides 3.5s, the follow slide 2.5s. Silent AAC track: the API can't add licensed music.
// -bitexact keeps the output byte-identical for the same slides, so re-rendering a PR adds no new commit.
import { readdirSync, existsSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { execFileSync } from "node:child_process";

const INK = "0x0A0A0C";
const COVER = 2.5, BODY = 3.5, LAST = 2.5;

function reel(dir) {
  dir = resolve(dir);
  const slides = readdirSync(join(dir, "slides")).filter(f => f.endsWith(".jpg")).sort();
  if (slides.length < 2) throw new Error(`${dir}: needs rendered slides first`);
  const secs = slides.map((_, i) => (i === 0 ? COVER : i === slides.length - 1 ? LAST : BODY));
  const inputs = slides.flatMap((f, i) => ["-loop", "1", "-framerate", "30", "-t", String(secs[i]), "-i", join(dir, "slides", f)]);
  const total = secs.reduce((a, b) => a + b, 0);
  const pad = slides.map((_, i) =>
    `[${i}:v]scale=1080:1350,pad=1080:1920:0:285:color=${INK},setsar=1,format=yuv420p[v${i}]`).join(";");
  const concat = slides.map((_, i) => `[v${i}]`).join("") + `concat=n=${slides.length}:v=1:a=0[v]`;
  const out = join(dir, "reel.mp4");
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", ...inputs,
    "-f", "lavfi", "-t", String(total), "-i", "anullsrc=channel_layout=stereo:sample_rate=48000",
    "-filter_complex", `${pad};${concat}`,
    "-map", "[v]", "-map", `${slides.length}:a`,
    "-c:v", "libx264", "-preset", "medium", "-crf", "23", "-r", "30", "-g", "60", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "128k", "-ar", "48000",
    "-movflags", "+faststart", "-fflags", "+bitexact", "-flags:v", "+bitexact", "-flags:a", "+bitexact",
    "-map_metadata", "-1", "-shortest", out,
  ]);
  console.log(`reel ${dir.split("/").pop()}: ${slides.length} slides, ${total}s, ${(statSync(out).size / 1e6).toFixed(1)} MB`);
}

let bad = 0;
for (const d of process.argv.slice(2)) {
  if (!existsSync(join(d, "slides"))) continue;
  try { reel(d); } catch (err) { bad++; console.error(`FAIL ${d}: ${err.message}`); }
}
process.exit(bad ? 1 : 0);
