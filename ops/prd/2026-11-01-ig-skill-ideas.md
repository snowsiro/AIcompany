# PRD: ideas from instagram-agent-skill (approved 2026-11-01 by 제이미)

Source: github.com/Jakeschincariol/instagram-agent-skill (MIT). We port ideas into our own code; we do not install
the skills or run their scripts in the pipeline. Full draft: https://claude.ai/artifact/GoTbYRbZNSmAUqyDE3ESKU

1. Reference scan outlier multiple: `scripts/ig.mjs scan` reads 25 posts per account and adds `multiple`
   (likes + comments over the account's median). Researcher lists 3x+ stories first. Topic picking only. (this PR)
2. Hook pre-filter: `scripts/hookscore.mjs`, five text checks. Back-test on past hook options first; drop it if it
   would reject more than 20% of hooks hook-judge passed. Back-test: 2 of 16 under 50, 0 under 45. 제이미 chose 45
   (2026-11-01); lint enforces it from posts dated 2026-11-02.
3. One-time profile audit against a 12-item rubric. Changes to the profile are made by 제이미. (report, no code)
5. Analyst: multiple (reach / 14-day same-format median), shares / reach, follows / reach. No conclusions under
   20 posts. (this PR)

Not doing: installing the skills, Reel scripts, stories, DMs, comment skills, changing hook-judge's pass bar.
Cost: none (same API call, no credits).
