// Instagram Graph API helper (Instagram API with Facebook Login; the account is linked to a Facebook Page).
// Needs env: IG_USER_ID, IG_ACCESS_TOKEN. Never print the token.
//
//   node scripts/ig.mjs discover <username>               last posts of another business/creator account
//   node scripts/ig.mjs publish posts/<id> <public-base>  post the rendered slides as one carousel
//   node scripts/ig.mjs insights [days]                   per-post metrics for the analyst
//   node scripts/ig.mjs reel posts/<id> <public-base>     post posts/<id>/reel.mp4 as a Trial Reel (non-followers first)
//   node scripts/ig.mjs reel-catchup <public-base>        same, for published posts from REEL_START on that have no Reel yet
//   node scripts/ig.mjs metrics <out.json> [days]         daily snapshot: per-post + account metrics (morning scan)
//   node scripts/ig.mjs limit                             publishing quota used in the last 24h
//   node scripts/ig.mjs check                             connection test: own account, quota, reference accounts
//   node scripts/ig.mjs scan <out.json> [hours]           reference accounts' posts from the last 48h (for the researcher)
//
// <public-base> is a URL where posts/ is reachable, e.g. https://raw.githubusercontent.com/snowsiro/AIcompany/main
// (Instagram downloads each image from a public URL; it does not accept uploads.)
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, resolve, relative, dirname } from "node:path";

const API = "https://graph.facebook.com/v26.0";
const { IG_USER_ID, IG_ACCESS_TOKEN } = process.env;
if (!IG_USER_ID || !IG_ACCESS_TOKEN) {
  console.error("IG_USER_ID and IG_ACCESS_TOKEN must be set (GitHub secrets).");
  process.exit(2);
}

// Meta's usage headers (percent of each limit used), kept from the latest call so errors and `check` can show them.
// An error names the call (method and path only; the token sits in the query or body and is never printed) and
// keeps Meta's subcode and user message, which tell an app-wide rate limit apart from an Instagram action block.
let lastUsage = {};
async function call(method, path, params = {}) {
  const url = new URL(API + path);
  const body = new URLSearchParams({ ...params, access_token: IG_ACCESS_TOKEN });
  const res = method === "GET"
    ? await fetch(`${url}?${body}`)
    : await fetch(url, { method, body });
  lastUsage = {};
  for (const h of ["x-app-usage", "x-business-use-case-usage"]) {
    const v = res.headers?.get?.(h);
    if (v) lastUsage[h] = v;
  }
  const json = await res.json();
  if (json.error) {
    const e = json.error;
    const detail = [`${method} ${path}`, e.error_subcode && `subcode ${e.error_subcode}`, e.error_user_title, e.error_user_msg,
      e.fbtrace_id && `trace ${e.fbtrace_id}`, ...Object.entries(lastUsage).map(([k, v]) => `${k} ${v}`)].filter(Boolean);
    throw new Error(`${e.type || "error"} ${e.code}: ${e.message} [${detail.join("; ")}]`);
  }
  return json;
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function discover(username) {
  const fields = `business_discovery.username(${username}){username,followers_count,media_count,` +
    `media.limit(12){caption,timestamp,like_count,comments_count,permalink,media_type}}`;
  const { business_discovery: bd } = await call("GET", `/${IG_USER_ID}`, { fields });
  console.log(JSON.stringify(bd, null, 2));
}

async function waitReady(containerId) {
  for (let i = 0; i < 30; i++) {
    const { status_code } = await call("GET", `/${containerId}`, { fields: "status_code" });
    if (status_code === "FINISHED") return;
    if (status_code === "ERROR" || status_code === "EXPIRED") throw new Error(`container ${containerId} ${status_code}`);
    await sleep(5000);
  }
  throw new Error(`container ${containerId} not ready after 150s`);
}

// A post can go live even when the API answers with an error. On 2026-10-26 Instagram said "Application request
// limit reached" after the carousel was already up, nothing was recorded, and each retried run posted it again (6 copies).
// So publish looks for the post among our latest posts first and only records it if it is there; if that check fails,
// it stops instead of posting blind. Once media_publish answers, the id is recorded before anything else can fail.
const firstLine = s => String(s || "").split("\n")[0].trim();
// Compares first lines loosely. On 2026-10-27 a post Jamie put up by hand from the app wasn't recognised, and the record
// run posted it a second time. Pasting on a phone can turn ' into ’, - into – or "..." into …, so the check ignores
// quote, dash and space shapes and letter case.
const sameLine = s => firstLine(s).normalize("NFKC")
  .replace(/[‘’‚‛′´`]/g, "'").replace(/[“”„‟″]/g, '"')
  .replace(/[‐-―−]/g, "-").replace(/…/g, "...").replace(/[​-‍⁠﻿]/g, "")
  .replace(/\s+/g, " ").trim().toLowerCase();

// The carousel and its Reel share a caption, so each check looks only at its own kind.
async function findPosted(post, kind = "FEED") {
  const want = sameLine(post.caption);
  if (!want) throw new Error(`${post.id}: caption is empty, can't check for an earlier copy`);
  const { data } = await call("GET", `/${IG_USER_ID}/media`, { fields: "id,caption,permalink,timestamp,media_product_type", limit: "25" });
  return (data || []).find(m => (m.media_product_type === "REELS") === (kind === "REELS") && sameLine(m.caption) === want) || null;
}

// Since 2026-10-26 Instagram often answers media_publish with code 4, subcode 2207051 ("Action is blocked") and puts the
// post up anyway. So on an error, wait a moment and look: if it is live, carry on as if Instagram had answered normally,
// and leave a warning in the log. If it is not live, fail as before. IG_RECHECK_MS only shortens the wait in tests.
async function mediaPublish(post, creationId, kind) {
  try {
    return await call("POST", `/${IG_USER_ID}/media_publish`, { creation_id: creationId });
  } catch (err) {
    await sleep(Number(process.env.IG_RECHECK_MS || 15000));
    const live = await findPosted(post, kind).catch(() => null);
    if (!live) throw err;
    console.log(`::warning::Instagram answered "${err.message.slice(0, 160)}" but the ${kind === "REELS" ? "Reel" : "post"} is live; recorded it`);
    return { id: live.id, permalink: live.permalink };
  }
}

function recordPublished(dir, post, mediaId, permalink) {
  post.published_id = mediaId;
  if (permalink) post.permalink = permalink;
  post.status = "published";
  writeFileSync(join(dir, "post.json"), JSON.stringify(post, null, 2) + "\n");
}

async function publish(dir, base) {
  dir = resolve(dir);
  const post = JSON.parse(readFileSync(join(dir, "post.json"), "utf8"));
  if (post.published_id) {
    if (!post.permalink) {
      const { permalink } = await call("GET", `/${post.published_id}`, { fields: "permalink" });
      if (permalink) recordPublished(dir, post, post.published_id, permalink);
    }
    console.log(`already published: ${post.permalink || post.published_id}`);
    return;
  }
  const rel = relative(process.cwd(), dir).split("\\").join("/");
  const files = readdirSync(join(dir, "slides")).filter(f => f.endsWith(".jpg")).sort();
  if (files.length < 2 || files.length > 20) throw new Error(`carousel needs 2-20 images, found ${files.length}`);

  const live = await findPosted(post);
  if (live) {
    recordPublished(dir, post, live.id, live.permalink);
    console.log(`already on Instagram, recorded without posting again: ${live.permalink || live.id}`);
    return;
  }
  // Record-only runs (IG_RECORD_ONLY=1) follow a post Jamie put up by hand: they record it and never post a copy.
  if (process.env.IG_RECORD_ONLY) {
    throw new Error(`${post.id}: not found among our latest posts, and this is a record-only run, so nothing was posted. ` +
      `Check that the caption's first line was pasted unchanged, or run again in a minute (a new post can take a moment to show up)`);
  }

  const children = [];
  for (const f of files) {
    const { id } = await call("POST", `/${IG_USER_ID}/media`, { image_url: `${base}/${rel}/slides/${f}`, is_carousel_item: "true" });
    children.push(id);
  }
  for (const id of children) await waitReady(id);

  const caption = `${post.caption}\n\n${post.hashtags.join(" ")}`;
  const { id: carousel } = await call("POST", `/${IG_USER_ID}/media`, { media_type: "CAROUSEL", children: children.join(","), caption });
  await waitReady(carousel);
  const { id: mediaId, permalink: known } = await mediaPublish(post, carousel, "FEED");

  // The post is live from here on: record it first, then look up the permalink (optional; a later run fills it in).
  recordPublished(dir, post, mediaId, known || null);
  if (known) { console.log(`published ${post.id}: ${known}`); return; }
  try {
    const { permalink } = await call("GET", `/${mediaId}`, { fields: "permalink" });
    if (permalink) recordPublished(dir, post, mediaId, permalink);
    console.log(`published ${post.id}: ${permalink || mediaId}`);
  } catch (err) {
    console.log(`published ${post.id} as ${mediaId}; permalink lookup failed (${err.message}), recorded without it`);
  }
}

async function insights(days = 7) {
  const since = Date.now() - days * 864e5;
  const { data } = await call("GET", `/${IG_USER_ID}/media`, { fields: "id,caption,timestamp,permalink,like_count,comments_count", limit: "50" });
  const rows = [];
  for (const m of data.filter(m => Date.parse(m.timestamp) >= since)) {
    const ins = await call("GET", `/${m.id}/insights`, { metric: "reach,saved,shares,total_interactions,follows" }).catch(e => ({ error: e.message }));
    const metric = name => ins.data?.find(d => d.name === name)?.values?.[0]?.value ?? null;
    rows.push({
      id: m.id, timestamp: m.timestamp, permalink: m.permalink, first_line: (m.caption || "").split("\n")[0],
      likes: m.like_count, comments: m.comments_count,
      reach: metric("reach"), saves: metric("saved"), shares: metric("shares"), follows: metric("follows"),
      ...(ins.error ? { insights_error: ins.error } : {}),
    });
  }
  console.log(JSON.stringify(rows, null, 2));
}

// Trial Reels (added 2026-10-22, PRD "초기 도달 패키지" C): the same slides as a 9:16 video, shown to non-followers first.
// SS_PERFORMANCE lets Instagram move a Reel that does well onto the profile by itself (Jamie chose this, 2026-10-21).
// If the account can't post Trial Reels yet, it falls back to a normal Reel kept off the profile grid (share_to_feed=false),
// so followers never see the same story twice in their feed. The carousel is always posted and recorded first.
const REEL_START = "2026-10-22";
async function reel(dir, base) {
  dir = resolve(dir);
  const post = JSON.parse(readFileSync(join(dir, "post.json"), "utf8"));
  if (post.reel_id) { console.log(`reel already posted: ${post.reel_permalink}`); return; }
  if (!post.published_id) throw new Error(`${post.id}: carousel not published yet, the Reel goes after it`);
  const live = await findPosted(post, "REELS");
  if (live) {
    Object.assign(post, { reel_id: live.id, reel_trial: null }, live.permalink ? { reel_permalink: live.permalink } : {});
    writeFileSync(join(dir, "post.json"), JSON.stringify(post, null, 2) + "\n");
    console.log(`reel already on Instagram, recorded without posting again: ${live.permalink || live.id}`);
    return;
  }
  const rel = relative(process.cwd(), dir).split("\\").join("/");
  const params = { media_type: "REELS", video_url: `${base}/${rel}/reel.mp4`, caption: `${post.caption}\n\n${post.hashtags.join(" ")}` };
  let trial = true, container;
  try {
    ({ id: container } = await call("POST", `/${IG_USER_ID}/media`, { ...params, trial_params: JSON.stringify({ graduation_strategy: "SS_PERFORMANCE" }) }));
  } catch (err) {
    console.log(`trial reel refused (${err.message}); posting a normal Reel kept off the grid`);
    trial = false;
    ({ id: container } = await call("POST", `/${IG_USER_ID}/media`, { ...params, share_to_feed: "false" }));
  }
  // video processing takes longer than images: wait up to 10 minutes
  for (let i = 0; ; i++) {
    const { status_code, status } = await call("GET", `/${container}`, { fields: "status_code,status" });
    if (status_code === "FINISHED") break;
    if (status_code === "ERROR" || status_code === "EXPIRED") throw new Error(`reel container ${status_code}: ${status || ""}`);
    if (i >= 60) throw new Error("reel container not ready after 10 minutes");
    await sleep(10000);
  }
  const { id: mediaId, permalink: known } = await mediaPublish(post, container, "REELS");
  // Same rule as the carousel: once it is live, record it before the optional permalink lookup.
  Object.assign(post, { reel_id: mediaId, reel_trial: trial }, known ? { reel_permalink: known } : {});
  writeFileSync(join(dir, "post.json"), JSON.stringify(post, null, 2) + "\n");
  if (known) { console.log(`reel ${post.id}: ${known}`); return; }
  try {
    const { permalink } = await call("GET", `/${mediaId}`, { fields: "permalink" });
    if (permalink) {
      post.reel_permalink = permalink;
      writeFileSync(join(dir, "post.json"), JSON.stringify(post, null, 2) + "\n");
    }
    console.log(`reel ${post.id}${trial ? " (trial)" : ""}: ${permalink || mediaId}`);
  } catch (err) {
    console.log(`reel ${post.id} posted as ${mediaId}; permalink lookup failed (${err.message}), recorded without it`);
  }
}

async function reelCatchup(base) {
  for (const d of readdirSync("posts").filter(d => d >= REEL_START).sort()) {
    const file = join("posts", d, "post.json");
    if (!existsSync(file) || !existsSync(join("posts", d, "reel.mp4"))) continue;
    const p = JSON.parse(readFileSync(file, "utf8"));
    if (p.published_id && !p.reel_id) await reel(join("posts", d), base);
  }
}

// Daily snapshot for the morning report and the 11-04 / 11-18 reviews (added 2026-10-22).
// Meta can take up to 48h to settle the numbers, so each run re-reads lifetime totals for the last <days> days
// and the newest file is always the one to trust. A metric Meta refuses is left out (null), never guessed.
const POST_METRICS = {
  FEED: ["reach", "views", "saved", "shares", "likes", "comments", "total_interactions", "follows", "profile_visits"],
  REELS: ["reach", "views", "saved", "shares", "likes", "comments", "total_interactions", "ig_reels_avg_watch_time"],
};
async function mediaInsights(id, kind) {
  const out = {}, failed = [];
  const read = async names => {
    const { data } = await call("GET", `/${id}/insights`, { metric: names.join(",") });
    for (const d of data || []) out[d.name] = d.values?.[0]?.value ?? d.total_value?.value ?? null;
  };
  try { await read(POST_METRICS[kind]); }
  catch {
    // one unsupported metric fails the whole request, so fall back to one at a time
    for (const m of POST_METRICS[kind]) await read([m]).catch(() => failed.push(m));
  }
  return { ...out, ...(failed.length ? { unavailable: failed } : {}) };
}

function postIndex() {
  const byMedia = {};
  for (const d of readdirSync("posts").filter(d => /^\d{4}-/.test(d))) {
    try {
      const p = JSON.parse(readFileSync(join("posts", d, "post.json"), "utf8"));
      if (p.published_id) byMedia[p.published_id] = { post: p.id, format: "carousel", hook_type: p.cover?.hook_type ?? null, region: (p.cover?.tag || "").split(" ")[0] || null, category: p.category };
      if (p.reel_id) byMedia[p.reel_id] = { post: p.id, format: "reel", hook_type: p.cover?.hook_type ?? null, region: (p.cover?.tag || "").split(" ")[0] || null, category: p.category };
    } catch { /* a broken post.json is lint's job */ }
  }
  return byMedia;
}

async function metrics(out, days = 14) {
  if (!out) throw new Error("usage: metrics <out.json> [days]");
  const since = Date.now() - days * 864e5;
  const index = postIndex();
  const me = await call("GET", `/${IG_USER_ID}`, { fields: "followers_count,media_count" });
  const { data } = await call("GET", `/${IG_USER_ID}/media`, { fields: "id,timestamp,permalink,media_type,media_product_type", limit: "50" });
  const posts = [];
  for (const m of data.filter(m => Date.parse(m.timestamp) >= since)) {
    const kind = m.media_product_type === "REELS" ? "REELS" : "FEED";
    posts.push({ media_id: m.id, ...(index[m.id] || { post: null }), published_at: m.timestamp, url: m.permalink,
      ...(await mediaInsights(m.id, kind).catch(e => ({ error: e.message }))) });
  }
  // account totals for the last full Vienna day (yesterday)
  const vienna = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Vienna" }));
  const offset = vienna - new Date(new Date().toLocaleString("en-US", { timeZone: "UTC" }));
  const midnight = Date.UTC(vienna.getFullYear(), vienna.getMonth(), vienna.getDate()) - offset;
  const range = { since: String(Math.floor((midnight - 864e5) / 1000)), until: String(Math.floor(midnight / 1000)) };
  const account = { day: new Date(midnight - 864e5 + offset).toISOString().slice(0, 10), followers: me.followers_count, media_count: me.media_count };
  for (const metric of ["reach", "views", "accounts_engaged", "profile_links_taps", "follows_and_unfollows"]) {
    try {
      const { data: d } = await call("GET", `/${IG_USER_ID}/insights`, { metric, period: "day", metric_type: "total_value", ...range });
      account[metric] = d?.[0]?.total_value?.value ?? null;
    } catch (err) { account[metric] = null; (account.unavailable ||= []).push(`${metric}: ${err.message.slice(0, 120)}`); }
  }
  const result = { fetched_at: new Date().toISOString(), days, account, posts };
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(result, null, 1) + "\n");
  const failed = posts.filter(p => p.error).length;
  console.log(`metrics: ${posts.length} posts (${failed} failed), followers ${me.followers_count}, yesterday reach ${account.reach} -> ${out}`);
  if (posts.length && failed === posts.length) throw new Error("no post insights could be read (check instagram_manage_insights on the token)");
}

function referenceAccounts() {
  const yaml = readFileSync("config/sources.yaml", "utf8");
  const block = yaml.split(/^reference_accounts:/m)[1].split(/\n\S/)[0];
  return [...block.matchAll(/^\s*-\s*(\S+)/gm)].map(m => m[1]);
}

// Runs in GitHub Actions before the morning routine, because the routine has no Instagram token.
// Keeps only what topic picking needs: a short caption excerpt, time, counts and link. Captions are
// cut short on purpose: this file sits in a public repo, and the wording is never reused anyway.
async function scan(out, hours = 48) {
  if (!out) throw new Error("usage: scan <out.json> [hours]");
  const since = Date.now() - hours * 36e5;
  const accounts = [];
  for (const username of referenceAccounts()) {
    try {
      const fields = `business_discovery.username(${username}){username,followers_count,` +
        `media.limit(15){caption,timestamp,like_count,comments_count,permalink,media_type}}`;
      const { business_discovery: bd } = await call("GET", `/${IG_USER_ID}`, { fields });
      const posts = (bd.media?.data || []).filter(m => Date.parse(m.timestamp) >= since).map(m => ({
        timestamp: m.timestamp, url: m.permalink, type: m.media_type,
        likes: m.like_count ?? null, comments: m.comments_count ?? null,
        caption_start: (m.caption || "").replace(/\s+/g, " ").trim().slice(0, 280),
      }));
      accounts.push({ username, followers: bd.followers_count, ok: true, posts });
    } catch (err) {
      accounts.push({ username, ok: false, error: err.message, posts: [] });
    }
  }
  const result = { fetched_at: new Date().toISOString(), hours, accounts };
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(result, null, 1) + "\n");
  const ok = accounts.filter(a => a.ok).length;
  console.log(`reference accounts read: ${ok}/${accounts.length}, posts in last ${hours}h: ${accounts.reduce((n, a) => n + a.posts.length, 0)} -> ${out}`);
  if (ok === 0) throw new Error("no reference account could be read");
}

// Connection test after the token is set up. Prints only public account data, never the token.
async function check() {
  const me = await call("GET", `/${IG_USER_ID}`, { fields: "username,followers_count,media_count" });
  console.log(`account: @${me.username} (${me.followers_count} followers, ${me.media_count} posts)`);
  // Meta sends these only once usage is noticeable; none means far from every limit.
  console.log(`api usage: ${Object.keys(lastUsage).length ? JSON.stringify(lastUsage) : "no usage headers (far from the limits)"}`);
  try {
    // Token type and expiry only; the token itself is never printed.
    const { data: t } = await call("GET", "/debug_token", { input_token: IG_ACCESS_TOKEN });
    const when = s => (s ? new Date(s * 1000).toISOString().slice(0, 10) : "never");
    console.log(`token: ${t.type}, valid ${t.is_valid}, expires ${when(t.expires_at)}, data access expires ${when(t.data_access_expires_at)}`);
  } catch (err) {
    console.log(`token: could not inspect (${err.message})`);
  }
  try {
    const limit = await call("GET", `/${IG_USER_ID}/content_publishing_limit`, { fields: "quota_usage,config" });
    console.log(`publishing quota: ${JSON.stringify(limit.data?.[0] ?? limit)}`);
  } catch (err) {
    console.log(`publishing quota: could not read (${err.message})`);
  }
  const accounts = referenceAccounts();
  let ok = 0;
  for (const username of accounts) {
    try {
      const fields = `business_discovery.username(${username}){username,followers_count,media_count}`;
      const { business_discovery: bd } = await call("GET", `/${IG_USER_ID}`, { fields });
      console.log(`  ok   @${bd.username}: ${bd.followers_count} followers, ${bd.media_count} posts`);
      ok++;
    } catch (err) {
      console.log(`  fail @${username}: ${err.message}`);
    }
  }
  console.log(`reference accounts readable: ${ok}/${accounts.length}`);
  console.log(`api usage after check: ${Object.keys(lastUsage).length ? JSON.stringify(lastUsage) : "no usage headers"}`);
}

const [cmd, ...args] = process.argv.slice(2);
try {
  if (cmd === "discover") await discover(args[0]);
  else if (cmd === "publish") await publish(args[0], args[1]);
  else if (cmd === "insights") await insights(Number(args[0] || 7));
  else if (cmd === "check") await check();
  else if (cmd === "reel") await reel(args[0], args[1]);
  else if (cmd === "reel-catchup") await reelCatchup(args[0]);
  else if (cmd === "metrics") await metrics(args[0], Number(args[1] || 14));
  else if (cmd === "scan") await scan(args[0], Number(args[1] || 48));
  else if (cmd === "limit") console.log(JSON.stringify(await call("GET", `/${IG_USER_ID}/content_publishing_limit`, { fields: "quota_usage,config" })));
  else { console.error("commands: discover | publish | reel | reel-catchup | insights | metrics | limit | check | scan"); process.exit(2); }
} catch (err) {
  console.error(`FAIL ${cmd}: ${err.message}`);
  process.exit(1);
}
