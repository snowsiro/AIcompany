# AI News Company

The AI office behind **[@ai.news.company](https://www.instagram.com/ai.news.company/)**: two English card news posts a day about AI news from around the world, Korea included.

## How it runs

```
05:07 Vienna  GitHub Actions "morning-scan" saves the reference accounts' recent posts and new AI articles
           from each outlet's RSS to ops/scan/<date>/ (the routine has no Instagram token, and some sites block it)

05:45 Vienna  Claude Code (scheduled, in the cloud) makes 2 posts
           researcher → editor-in-chief → writer → designer → 3 independent reviewers
           → one pull request "post: <date> <headline 1> + <headline 2>"
           GitHub Actions "render" re-renders the slides with the real cover and adds them to the PR

06:13 Vienna  Claude checks each ready post against its original article and merges the PR if it passes
           (Jamie's choice, 2026-10-20). To pull a post, tell Claude before it goes out.

13:57 Vienna  GitHub Actions "publish" posts the oldest ready post as a carousel, then checks it is live
19:57 Vienna  "publish" again for the second post
           It ticks every 30 minutes for 90 minutes after each slot, so a late or dropped GitHub run is retried
           without anyone starting it; the 3-hour guard keeps it to one post per slot
Sundays    09:57 Vienna  "publish" posts that Sunday's weekly roundup "This week in AI" (posts/<date>-weekly),
           made by the morning run from the week's published posts with scripts/weekly.mjs. Retried until noon,
           then a missed one is skipped
Mondays    analyst writes ops/weekly/<date>.md from Instagram insights
```

No computer needs to stay on.

## Layout

| Path | What |
| --- | --- |
| `CLAUDE.md` | Company rules every agent reads first |
| `DESIGN.md` | Colors, fonts, cover and slide rules |
| `.claude/agents/` | The 8 roles |
| `playbooks/daily-run.md` | The prompt the daily job runs |
| `config/sources.yaml` | Reference accounts, news outlets, topic scoring |
| `config/budget.yaml` | Credit caps |
| `posts/<id>/post.json` | One post: cover, slides, facts, sources, caption |
| `posts/<id>/slides/*.jpg` | Rendered 1080×1350 slides |
| `templates/card.html` | The one template all slides use |
| `scripts/lint.mjs` | Rule checker (no AI) |
| `scripts/render.mjs` | Renders slides, fails if text does not fit |
| `scripts/weekly.mjs` | Builds the Sunday roundup from the week's published posts (no AI) |
| `scripts/ig.mjs` | Instagram Graph API: discover, scan, publish, insights, check |
| `scripts/feeds.mjs` | New AI articles from each outlet's RSS (Google News RSS as fallback) |
| `scripts/article.mjs` | Prints an article's own text, for checking facts word for word |
| `ops/scan/<date>/` | What morning-scan saved for the researcher |
| `ops/run-log.md` | Morning reports |

## Local commands

```
npm ci
npx playwright install chromium
npm run lint
node scripts/render.mjs posts/2026-10-01-korea-ai-for-all
```

## Setup still needed

- [ ] Meta developer app + Instagram token → GitHub secrets `IG_USER_ID`, `IG_ACCESS_TOKEN`
- [ ] Public image URLs for publishing (public repo, or another host)
- [ ] Cloud environment with network access to news sites and Instagram, for the daily job
- [ ] Turn on the daily schedule and the publish cron
