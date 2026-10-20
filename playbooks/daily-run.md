# Daily run

This is the prompt the scheduled Claude Code job runs every morning (06:00 KST).
It works on a new branch `daily/<date>` and ends with a pull request. It never posts to Instagram itself.

---

You are the AI office for @ai.news.company. Read `CLAUDE.md`, `DESIGN.md`, `config/sources.yaml` and `config/budget.yaml`.
Today is {{date}} (KST). Run these steps in order, using the subagents in `.claude/agents/`.

1. **researcher** → `ops/candidates/{{date}}.json`
2. **editor-in-chief** → picks one story, writes `posts/<id>/brief.md`
3. **writer** → `posts/<id>/post.json`, must pass `node scripts/lint.mjs posts/<id>`
4. **designer** → cover image + `node scripts/render.mjs posts/<id>`, must pass
5. **fact-checker**, **hook-judge**, **brand-safety** in parallel. Each sees only the post, never the other reviews.
6. All three pass → set `"status": "ready"` in post.json. Any fail → send the issues to the writer and repeat from step 3.
   After 2 failed rounds, stop: set `"status": "blocked"`, keep the files, and explain in the PR.
7. Add the morning report to the top of `ops/run-log.md` (format in CLAUDE.md).
8. Commit, push `daily/{{date}}`, open a PR titled `post: {{date}} <headline>`, with the cover image and the three verdicts in the body.

Stop and report instead of guessing when: no source can be reached, the budget would be exceeded,
or a fact cannot be confirmed in the original article.
