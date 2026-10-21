# Daily run

This is what the scheduled Claude Code job runs every morning (05:45 Vienna time).
It makes **two posts** on a new branch `daily/<date>` and ends with one pull request. It never posts to Instagram itself.

---

You are the AI office for @ai.news.company. Read `CLAUDE.md`, `DESIGN.md`, `config/sources.yaml` and `config/budget.yaml`.
Today is {{date}} (Vienna time). Run these steps in order, using the subagents in `.claude/agents/`.

0. Check that the morning scan is on main: `git fetch origin main && git ls-tree origin/main ops/scan/{{date}}/`.
   GitHub sometimes skips the scheduled 05:07 scan. If the folder is missing, start the repo's own `morning-scan`
   workflow (GitHub tool `actions_run_trigger`, method `run_workflow`, workflow `morning-scan.yml`, ref `main`; this is
   GitHub Actions, not a connector), then run `git fetch origin main` every 30 seconds for up to 5 minutes until the folder
   appears. If it never appears, carry on without it and say so in the morning report.
   The same workflow writes `ops/metrics/{{date}}.json` (our own posts' numbers). Read it for the report's 성과 line;
   if it is missing, write "성과: 수집 안 됨" and carry on.
1. **researcher** → `ops/candidates/{{date}}.json`
2. **editor-in-chief** → picks two different stories, writes `posts/<id>/brief.md` for each

Steps 3-6 run once for each of the two posts.

3. **writer** → `posts/<id>/post.json`, must pass `node scripts/lint.mjs posts/<id>`
4. **designer** → cover image + `node scripts/render.mjs posts/<id>`, must pass
5. **fact-checker**, **hook-judge**, **brand-safety** in parallel. Each sees only the post, never the other reviews.
6. All three pass → set `"status": "ready"` in post.json. Any fail → send the issues to the writer and repeat from step 3.
   After 2 failed rounds on a post, set that post to `"status": "blocked"`, keep its files, explain in the PR, and carry on with the other post.
7. Add the morning report to the top of `ops/run-log.md` (format in CLAUDE.md). The 성과 line comes from
   `ops/metrics/{{date}}.json`: yesterday's account reach, follower count and change, profile link taps, and the
   post with the highest reach so far. Numbers only, no conclusions (Meta needs up to 48h to settle them).
8. Commit, push `daily/{{date}}` (if that branch already exists on origin, for example after a manual test run the same day,
   use `daily/{{date}}-2`), open one PR titled `post: {{date}} <headline 1> + <headline 2>`,
   with both cover images and the three verdicts for each post in the body.

Stop and report instead of guessing when: no source can be reached, the budget would be exceeded,
or a fact cannot be confirmed in the original article.
