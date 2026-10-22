// Threads API helper: cross-posts the same slides that went to Instagram.
// Needs env: THREADS_ACCESS_TOKEN. THREADS_USER_ID is optional; without it the ID is looked up from the token (/me).
// Never print the token. Without a token every command says so and exits 0, so publish.yml keeps working before Threads is set up.
//
//   node scripts/threads.mjs publish posts/<id> <public-base>   post the rendered slides as one carousel
//   node scripts/threads.mjs catchup <public-base> [hours]       retry at most one post whose Threads attempt failed
//   node scripts/threads.mjs insights [days]                     per-post views for the analyst
//   node scripts/threads.mjs check                               connection test: profile, followers, quota
//   node scripts/threads.mjs refresh                             extend the long-lived token (writes the new one to $GITHUB_OUTPUT only)
//
// Docs: https://developers.facebook.com/docs/threads/posts/ (checked 2026-10-21): 2-20 carousel items, 500-character text,
// JPEG/PNG up to 8 MB and 320-1440 px wide, 250 posts per 24h, long-lived tokens last 60 days and can be refreshed
// once they are at least 24 hours old.
import { readFileSync, readdirSync, writeFileSync, appendFileSync } from "node:fs";
import { join, resolve, relative } from "node:path";

const API = "https://graph.threads.net/v1.0";
const { THREADS_ACCESS_TOKEN } = process.env;
if (!THREADS_ACCESS_TOKEN) {
  console.log("Threads is not set up (THREADS_ACCESS_TOKEN secret missing), skipping.");
  process.exit(0);
}

async function call(method, path, params = {}, base = API) {
  const url = new URL(base + path);
  const body = new URLSearchParams({ ...params, access_token: THREADS_ACCESS_TOKEN });
  const res = method === "GET"
    ? await fetch(`${url}?${body}`)
    : await fetch(url, { method, body });
  const json = await res.json();
  if (json.error) throw new Error(`${json.error.type || "error"} ${json.error.code}: ${json.error.message}`);
  return json;
}
// Set below, after call() exists: the secret if given, else the token's own profile ID.
let THREADS_USER_ID = process.env.THREADS_USER_ID;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function waitReady(containerId) {
  for (let i = 0; i < 30; i++) {
    const { status, error_message } = await call("GET", `/${containerId}`, { fields: "status,error_message" });
    if (status === "FINISHED") return;
    if (status === "ERROR" || status === "EXPIRED") throw new Error(`container ${containerId} ${status} ${error_message || ""}`.trim());
    await sleep(10000);
  }
  throw new Error(`container ${containerId} not ready after 300s`);
}

// Fallback when the writer left no threads_caption (posts made before 2026-10-21): first caption line plus the source.
function captionFor(post) {
  if (post.threads_caption) return post.threads_caption;
  const hook = (post.caption || "").split("\n")[0].trim();
  const s = post.sources?.[0];
  const text = `${hook}\n\nSource: ${s.outlet}, "${s.title_en || s.title}"${s.title_en ? ` (in ${s.language || "Korean"})` : ""}.`;
  if (Buffer.byteLength(text, "utf8") > 500) return `${hook}\n\nSource: ${s.outlet}.`;
  return text;
}

async function publish(dir, base) {
  dir = resolve(dir);
  const post = JSON.parse(readFileSync(join(dir, "post.json"), "utf8"));
  if (post.threads_id) { console.log(`already on Threads: ${post.threads_permalink}`); return; }
  if (post.status !== "published") throw new Error(`${post.id} is not on Instagram yet (status ${post.status}); Threads follows Instagram`);
  try {
    await postCarousel(dir, post, base);
  } catch (err) {
    post.threads_error = err.message; // marks it for catchup; posts from before Threads was set up never get this
    writeFileSync(join(dir, "post.json"), JSON.stringify(post, null, 2) + "\n");
    throw err;
  }
}

async function postCarousel(dir, post, base) {
  const rel = relative(process.cwd(), dir).split("\\").join("/");
  const files = readdirSync(join(dir, "slides")).filter(f => f.endsWith(".jpg")).sort();
  if (files.length < 2 || files.length > 20) throw new Error(`carousel needs 2-20 images, found ${files.length}`);
  const text = captionFor(post);
  if (Buffer.byteLength(text, "utf8") > 500) throw new Error(`Threads text is ${Buffer.byteLength(text, "utf8")} bytes (max 500)`);

  const children = [];
  for (const f of files) {
    const { id } = await call("POST", `/${THREADS_USER_ID}/threads`, {
      media_type: "IMAGE", image_url: `${base}/${rel}/slides/${f}`, is_carousel_item: "true",
    });
    children.push(id);
  }
  for (const id of children) await waitReady(id);

  const { id: carousel } = await call("POST", `/${THREADS_USER_ID}/threads`, { media_type: "CAROUSEL", children: children.join(","), text });
  await sleep(30000); // Meta recommends about 30 seconds between creating a container and publishing it
  await waitReady(carousel);
  const { id: mediaId } = await call("POST", `/${THREADS_USER_ID}/threads_publish`, { creation_id: carousel });

  // Threads omits permalink for posts flagged for copyright, so a missing one is worth a look.
  // Past this point the post is live, so nothing may throw (a throw would mark it for a retry and post it twice).
  const permalink = await call("GET", `/${mediaId}`, { fields: "id,permalink" }).then(r => r.permalink, () => null);
  post.threads_id = mediaId;
  post.threads_permalink = permalink || null;
  delete post.threads_error;
  writeFileSync(join(dir, "post.json"), JSON.stringify(post, null, 2) + "\n");
  console.log(`on Threads ${post.id}: ${permalink || `(no permalink returned for ${mediaId})`}`);
}

// A Threads failure never blocks Instagram, so a post can end up on Instagram only, marked with threads_error.
// The next publish run calls this to retry the oldest such post from the last `hours`, one per run.
// Only failed attempts are retried: posts published before Threads was set up are never back-filled by this.
async function catchup(base, hours = 48) {
  const since = Date.now() - hours * 36e5;
  for (const d of readdirSync("posts").filter(d => /^\d{4}-/.test(d)).sort()) {
    let post;
    try { post = JSON.parse(readFileSync(join("posts", d, "post.json"), "utf8")); } catch { continue; }
    if (post.status !== "published" || post.threads_id || !post.threads_error) continue;
    if (Date.parse(post.date) < since - 864e5) continue; // post.date has no time; allow a day of slack
    console.log(`retrying Threads for ${post.id}`);
    await publish(join("posts", d), base);
    return;
  }
  console.log("no failed Threads post to retry");
}

async function insights(days = 7) {
  const since = Date.now() - days * 864e5;
  const { data } = await call("GET", `/${THREADS_USER_ID}/threads`, { fields: "id,permalink,timestamp,text", limit: "50" });
  const rows = [];
  for (const m of data.filter(m => Date.parse(m.timestamp) >= since)) {
    const ins = await call("GET", `/${m.id}/insights`, { metric: "views,likes,replies,reposts,quotes,shares" }).catch(e => ({ error: e.message }));
    const metric = name => ins.data?.find(d => d.name === name)?.values?.[0]?.value ?? ins.data?.find(d => d.name === name)?.total_value?.value ?? null;
    rows.push({
      id: m.id, timestamp: m.timestamp, permalink: m.permalink, first_line: (m.text || "").split("\n")[0],
      views: metric("views"), likes: metric("likes"), replies: metric("replies"), reposts: metric("reposts"),
      quotes: metric("quotes"), shares: metric("shares"),
      ...(ins.error ? { insights_error: ins.error } : {}),
    });
  }
  console.log(JSON.stringify(rows, null, 2));
}

async function check() {
  const me = await call("GET", "/me", { fields: "id,username" });
  const idNote = !process.env.THREADS_USER_ID ? "id taken from the token" : me.id === THREADS_USER_ID ? "id matches THREADS_USER_ID" : "id DOES NOT MATCH THREADS_USER_ID";
  console.log(`profile: @${me.username} (${idNote})`);
  try {
    const { data } = await call("GET", `/${THREADS_USER_ID}/threads_insights`, { metric: "followers_count" });
    console.log(`followers: ${data?.[0]?.total_value?.value ?? "unknown"}`);
  } catch (err) {
    console.log(`followers: could not read (${err.message}); needs the threads_manage_insights permission`);
  }
  const limit = await call("GET", `/${THREADS_USER_ID}/threads_publishing_limit`, { fields: "quota_usage,config" });
  console.log(`publishing quota: ${JSON.stringify(limit.data?.[0] ?? limit)}`);
}

// The refreshed token is written only to $GITHUB_OUTPUT (masked first), for the workflow to store as a secret.
async function refresh() {
  const t = await call("GET", "/refresh_access_token", { grant_type: "th_refresh_token" }, "https://graph.threads.net");
  const days = Math.round((t.expires_in || 0) / 86400);
  if (!t.access_token) throw new Error("refresh returned no token");
  if (process.env.GITHUB_OUTPUT) {
    console.log(`::add-mask::${t.access_token}`);
    appendFileSync(process.env.GITHUB_OUTPUT, `token=${t.access_token}\nchanged=${t.access_token !== THREADS_ACCESS_TOKEN}\n`);
  }
  console.log(`token refreshed, valid for about ${days} more days${t.access_token === THREADS_ACCESS_TOKEN ? " (same token)" : " (new token)"}`);
}

const [cmd, ...args] = process.argv.slice(2);
try {
  if (!THREADS_USER_ID && cmd !== "refresh") THREADS_USER_ID = (await call("GET", "/me", { fields: "id" })).id;
  if (cmd === "publish") await publish(args[0], args[1]);
  else if (cmd === "catchup") await catchup(args[0], Number(args[1] || 48));
  else if (cmd === "insights") await insights(Number(args[0] || 7));
  else if (cmd === "check") await check();
  else if (cmd === "refresh") await refresh();
  else { console.error("commands: publish | catchup | insights | check | refresh"); process.exit(2); }
} catch (err) {
  console.error(`FAIL ${cmd}: ${err.message}`);
  process.exit(1);
}
