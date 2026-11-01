# PRD: Story auto-post (approved 2026-11-01 by 제이미, "추천으로 진행")

Full draft: https://claude.ai/artifact/G4eEDYkdLN4LfTcUpMFY7Y

- Each published post (from posts dated 2026-11-02) gets one 1080x1920 Story: the cover slide on a blurred copy of
  itself, with "NEW POST / Tap our profile" (the API can't add a link sticker). `scripts/story.mjs`, templates/story.html,
  rendered in CI next to the Reel. No new images, no credits.
- publish.yml posts it after the carousel and Reel (continue-on-error), records `story_id` in post.json, commits as
  "story: ". Duplicate check: a live Story of ours newer than the carousel counts as this post's Story.
  story-catchup retries posts published within the last 12h.
- metrics reads live Stories' insights in the morning snapshot (Story insights vanish after 24h).
- Not doing: link/poll stickers, highlights (no API), several frames per post, music.
- 제이미 chose: text "New post · tap our profile"; see a sample before the first live Story.
