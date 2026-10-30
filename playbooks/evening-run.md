# Evening run

This is what the scheduled Claude Code job runs every evening (19:15 Vienna time). It makes **one post** from the day's
newest news, usually a US afternoon announcement, for the 20:57 slot. The morning run (`playbooks/daily-run.md`) made
the 13:57 post. Adopted 2026-10-30 by Jamie after the 10/28-10/30 trial (PRD `ops/prd/2026-10-27-evening-slot.md`).
It never posts to Instagram itself; the publish workflow does.

---

You are the AI office for @ai.news.company. Read `CLAUDE.md`, `DESIGN.md`, `config/sources.yaml` and `config/budget.yaml`.
Today is {{date}} (Vienna time). Run these steps in order, using the subagents in `.claude/agents/`.

0. **Backlog check.** `git fetch origin main`. If a single post on main is still `"status": "ready"` (publish
   sets it to "published"), for example the morning post when the 13:57 slot was skipped, make no new post: that post takes
   the 20:57 slot. Write the evening report (step 7) saying so and stop.
1. **researcher** (evening) → `ops/candidates/{{date}}-evening.json`
   - Only articles first published after 05:45 Vienna today. Record each story's first-published time (UTC).
   - There is no new scan in the evening: use `ops/scan/{{date}}/feeds.json` and your own scan of `news_sources`.
   - Also carry over the stories from `ops/candidates/{{date}}.json` that the morning run did not use, marked `carried_over`
     (the file is missing when the morning run skipped research; then use only new stories).
2. **editor-in-chief** (evening pick) → one story, `posts/<id>/brief.md`
   - Score with `config/sources.yaml` → `scoring`, including `fresh_within_6h_evening` (+2 for a story first published
     in the 6 hours before this run started).
   - It must be a different company and lead with a different outlet than the morning post.
   - If no new story scores at least 6, take the best carried-over story. Never leave the slot empty for lack of news.
3. **writer** → `posts/<id>/post.json`, must pass `node scripts/lint.mjs posts/<id>`
4. **designer** → one cover image (2 credits; the day's total stays within `config/budget.yaml`) +
   `node scripts/render.mjs posts/<id>`, must pass
5. **fact-checker**, **hook-judge**, **brand-safety** in parallel, same rules as the morning. Each sees only the post.
6. All three pass → `"status": "ready"`. Any fail → back to the writer and repeat from step 3. After 2 failed rounds set
   `"status": "blocked"`, explain it in the PR and report; the slot stays empty that evening.
7. Add the evening report to the top of `ops/run-log.md`: the CLAUDE.md format with the heading `## [저녁 보고] {{date}}`
   and no 성과 line. Include the story's first-published time and its age at ready.
8. Commit, push `daily/{{date}}-evening`, open one PR titled `post: {{date}} evening <headline>` with the cover image and
   the three verdicts in the body. Aim for ready by 20:30.
9. **Merge and post.** If the post is ready, check every number, name, date and quote once more against the article text
   (`node scripts/article.mjs <url>`), then merge the PR yourself (squash or merge commit, never force-push main).
   - Merged before 20:57: done. The 20:57 publish start posts it.
   - Merged between 20:57 and 23:00 Vienna: start the publish workflow yourself (GitHub tool `actions_run_trigger`,
     method `run_workflow`, workflow `publish.yml`, ref `main`, no inputs). Its 3-hour guard prevents a double post.
   - Not ready by 23:00: leave it ready on main. Tomorrow's morning run sees it in its backlog check and makes no new
     post, so it takes the 13:57 slot.

Stop and report instead of guessing when: no source can be reached, the budget would be exceeded,
or a fact cannot be confirmed in the original article. End with a one-line push notification of the result.
