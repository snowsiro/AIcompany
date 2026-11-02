# Brief: 2026-11-02-merz-ai-sovereignty (evening run)

Score 10 = global relevance 3 + hard number 2 + Europe angle 3 + fresh_within_6h_evening 2 (first published 17:52Z, run started 18:15Z, so about 23 minutes old). No reference-account data in the evening (0), no same-company penalty (morning post was Korea exports / Korea Herald), not posted in the last 14 days (0).
Runners-up: Marvell-Lumentum $115B (7), Anthropic amended S-1 (7, Anthropic is covered too often), OpenAI Grid Protectors (7), NYT sues Brave (5).

1. 결과: Make one single post. REGION EUROPE, CATEGORY POLICY (tag `EUROPE AI · POLICY`). Angle: Germany's chancellor calls AI independence "a truly existential question", and the money and targets behind it (more than EUR 225bn in pledges, 4x AI computing power by 2030), against a reality check from the Ifo institute (not ready to benefit fully). Suggested hook types: quote ("EXISTENTIAL" - Merz on AI), number (EUR 225BN), myth-flip/claim (Europe says it cannot depend on others). Reader-impact hook only if the article supports it; it does not, so write "No reader-impact hook:" in hook_pick_reason. Cover has no real person (no Merz image or lookalike); use a graphic or abstract image.

2. 맥락: Every country is deciding whether to rent AI from US/Chinese providers or build its own. Europe's largest economy is saying so out loud, with a spending figure and a deadline, and the Ifo caveat gives the post tension (ambition vs readiness). Facts that carry it:
   - German Chancellor Friedrich Merz said Monday (2 Nov) that Germany and Europe must move faster to build their own AI technology or risk dependence on outside providers (per Reuters, via TNW).
   - Spoke at an AI conference in Berlin; called digital sovereignty "a truly existential question".
   - Germany must "at all costs, avoid becoming entirely dependent on third parties." (quote exactly)
   - Companies including Amazon and Nvidia joined pledges worth more than EUR 225bn at a summit last month, according to the economy ministry.
   - Germany aims to quadruple its AI computing power by 2030.
   - The Ifo institute found Germany is still not ready to benefit fully from the AI boom: relatively small high-tech sector, weak digital public services, skills shortages.
   Unknown to a global reader, explain in one line on first mention: the Ifo institute (a German economic research institute; the article gives no more than "Ifo institute", so describe it only as a German economic think tank if the writer confirms it from the article text, otherwise say "Germany's Ifo institute"). Friedrich Merz: "Germany's chancellor" is enough. Nvidia and Amazon are household names.

3. 제약: Facts only from the listed articles. Do not add other Merz quotes, dates of the summit, or investment breakdowns.
   - Primary (only readable) source: The Next Web, "Chancellor Friedrich Merz says Germany and Europe must build their own AI more quickly" (2026-11-02), https://thenextweb.com/news/merz-germany-digital-sovereignty-ai . TNW cites Reuters and the economy ministry; attribute accordingly ("according to Reuters", "according to the economy ministry"). Run `node scripts/article.mjs <url>` to re-read it.
   - Optional second source, NOT read yet: Politico Europe, "Berlin unveils blueprint to catch up on AI" (in the feed). Use only if the writer or fact-checker can fetch and confirm; otherwise leave out.
   - Currency: article gives EUR only with no exchange rate. Per CLAUDE.md, a dollar value needs a rate from the article, so write "EUR 225bn" with no dollar conversion, or flag it. Do not invent a rate.
   - Source line on last slide and caption: outlet name + article title (+ date). Single outlet is acceptable; say Reuters is cited inside the article.
   - No real-person photos or lookalikes; no news photos; DESIGN.md colors, fonts and limits (cover title max 16 chars per line, 2 lines, one accent word; body max 45 words; accent max 2 per slide).

4. 질문 기준: Flag, do not guess, if:
   - "pledges worth more than EUR 225bn" is ambiguous: the article does not say who pledged what, over what period, or whether it is Germany-only. Say it exactly as written, with no "invest" or "will spend" framing beyond the source.
   - "quadruple AI computing power by 2030" has no baseline in the article. Do not add one.
   - The Ifo findings are not dated or linked to the conference; do not imply Merz responded to them.
   - Whether the post should say "Europe" vs "Germany": Merz spoke of "Germany and Europe", but the pledges and the 2030 target are Germany's. Keep the two apart.
   - Single secondary source (TNW relaying Reuters): if the fact-checker cannot confirm any number against the article text, drop it.
