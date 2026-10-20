// Instagram Graph API helper (Instagram API with Facebook Login; the account is linked to a Facebook Page).
// Needs env: IG_USER_ID, IG_ACCESS_TOKEN. Never print the token.
//
//   node scripts/ig.mjs discover <username>               last posts of another business/creator account
//   node scripts/ig.mjs publish posts/<id> <public-base>  post the rendered slides as one carousel
//   node scripts/ig.mjs insights [days]                   per-post metrics for the analyst
//   node scripts/ig.mjs limit                             publishing quota used in the last 24h
//   node scripts/ig.mjs check                             connection test: own account, quota, reference accounts
//
// <public-base> is a URL where posts/ is reachable, e.g. https://raw.githubusercontent.com/snowsiro/AIcompany/main
// (Instagram downloads each image from a public URL; it does not accept uploads.)
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve, relative } from "node:path";

const API = "https://graph.facebook.com/v26.0";
const { IG_USER_ID, IG_ACCESS_TOKEN } = process.env;
if (!IG_USER_ID || !IG_ACCESS_TOKEN) {
  console.error("IG_USER_ID and IG_ACCESS_TOKEN must be set (GitHub secrets).");
  process.exit(2);
}

async function call(method, path, params = {}) {
  const url = new URL(API + path);
  const body = new URLSearchParams({ ...params, access_token: IG_ACCESS_TOKEN });
  const res = method === "GET"
    ? await fetch(`${url}?${body}`)
    : await fetch(url, { method, body });
  const json = await res.json();
  if (json.error) throw new Error(`${json.error.type || "error"} ${json.error.code}: ${json.error.message}`);
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

async function publish(dir, base) {
  dir = resolve(dir);
  const post = JSON.parse(readFileSync(join(dir, "post.json"), "utf8"));
  if (post.published_id) { console.log(`already published: ${post.permalink}`); return; }
  const rel = relative(process.cwd(), dir).split("\\").join("/");
  const files = readdirSync(join(dir, "slides")).filter(f => f.endsWith(".jpg")).sort();
  if (files.length < 2 || files.length > 20) throw new Error(`carousel needs 2-20 images, found ${files.length}`);

  const children = [];
  for (const f of files) {
    const { id } = await call("POST", `/${IG_USER_ID}/media`, { image_url: `${base}/${rel}/slides/${f}`, is_carousel_item: "true" });
    children.push(id);
  }
  for (const id of children) await waitReady(id);

  const caption = `${post.caption}\n\n${post.hashtags.join(" ")}`;
  const { id: carousel } = await call("POST", `/${IG_USER_ID}/media`, { media_type: "CAROUSEL", children: children.join(","), caption });
  await waitReady(carousel);
  const { id: mediaId } = await call("POST", `/${IG_USER_ID}/media_publish`, { creation_id: carousel });

  // publish-then-verify: confirm the post is actually live before recording it
  const { permalink } = await call("GET", `/${mediaId}`, { fields: "permalink,timestamp" });
  if (!permalink) throw new Error(`published ${mediaId} but no permalink came back`);
  post.published_id = mediaId;
  post.permalink = permalink;
  post.status = "published";
  writeFileSync(join(dir, "post.json"), JSON.stringify(post, null, 2) + "\n");
  console.log(`published ${post.id}: ${permalink}`);
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

// Connection test after the token is set up. Prints only public account data, never the token.
async function check() {
  const me = await call("GET", `/${IG_USER_ID}`, { fields: "username,followers_count,media_count" });
  console.log(`account: @${me.username} (${me.followers_count} followers, ${me.media_count} posts)`);
  try {
    // Token type and expiry only; the token itself is never printed.
    const { data: t } = await call("GET", "/debug_token", { input_token: IG_ACCESS_TOKEN });
    const when = s => (s ? new Date(s * 1000).toISOString().slice(0, 10) : "never");
    console.log(`token: ${t.type}, valid ${t.is_valid}, expires ${when(t.expires_at)}, data access expires ${when(t.data_access_expires_at)}`);
  } catch (err) {
    console.log(`token: could not inspect (${err.message})`);
  }
  const limit = await call("GET", `/${IG_USER_ID}/content_publishing_limit`, { fields: "quota_usage,config" });
  console.log(`publishing quota: ${JSON.stringify(limit.data?.[0] ?? limit)}`);
  const yaml = readFileSync("config/sources.yaml", "utf8");
  const block = yaml.split(/^reference_accounts:/m)[1].split(/\n\S/)[0];
  const accounts = [...block.matchAll(/^\s*-\s*(\S+)/gm)].map(m => m[1]);
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
}

const [cmd, ...args] = process.argv.slice(2);
try {
  if (cmd === "discover") await discover(args[0]);
  else if (cmd === "publish") await publish(args[0], args[1]);
  else if (cmd === "insights") await insights(Number(args[0] || 7));
  else if (cmd === "check") await check();
  else if (cmd === "limit") console.log(JSON.stringify(await call("GET", `/${IG_USER_ID}/content_publishing_limit`, { fields: "quota_usage,config" })));
  else { console.error("commands: discover | publish | insights | limit | check"); process.exit(2); }
} catch (err) {
  console.error(`FAIL ${cmd}: ${err.message}`);
  process.exit(1);
}
