# AI News Company

The AI office behind **[@ai.news.company](https://www.instagram.com/ai.news.company/)**: daily English card news about Korean AI, for readers outside Korea.

## How it runs

```
06:00 KST  Claude Code (scheduled, in the cloud)
           researcher → editor-in-chief → writer → designer → 3 independent reviewers
           → pull request "post: <date> <headline>"
           GitHub Actions "render" re-renders the slides with the real cover and adds them to the PR

           Jamie merges the PR (first 2 weeks), later auto-merge when all reviewers pass

22:00 KST  GitHub Actions "publish" posts the oldest ready post as a carousel, then checks it is live
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
| `scripts/ig.mjs` | Instagram Graph API: discover, publish, insights |
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
