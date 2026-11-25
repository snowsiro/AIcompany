# Brief: 2026-11-25-anthropic-openai-vp-vnp

- 결과: Morning post (13:57). Anthropic and OpenAI each published a paper within hours of each other, both claiming a proof of Valiant's VP != VNP conjecture (open since 1979). Tag: `GLOBAL AI · RESEARCH` (EUROPE also possible: lead outlet is heise online, Germany; the companies are US). Score 8 = global relevance 3 + hard numbers 2 (1979, 70 pages, 30 pages, Nov 23, Nov 6) + Europe-outlet angle 3. No reference-account coverage, no 14-day repeat, no overlap with the Asia/Europe slot rule (heise is Europe).

- 맥락: Two rival labs claiming to solve a 47-year-old math problem the same day is a race story anyone can follow. Carry it with these facts, all from article 0 (heise online, German, 2026-11-24, `https://www.heise.de/news/Mathe-Wettlauf-Anthropic-und-OpenAI-mit-fast-zeitgleichen-Beweisen-fuer-VP-VNP-11536640.html`; an English version exists, writer may check):
  1. Both companies published papers within a few hours that are said to solve a problem open since 1979.
  2. Anthropic: 70-page paper on Nov 23; the proof came from an internal Claude research model.
  3. OpenAI: 30-page paper a few hours later; by its own publication history it reached the result already on Nov 6.
  4. Both published Lean formalizations (Lean = a tool for machine-checking math proofs). Per Anthropic, the check passed in Lean and in the independently built proof checker nanoda.
  5. Independent expert confirmation of both papers is still pending. This must be on the cover-adjacent slide and in the caption.
  6. Context (optional, one slide max): last week Anthropic mathematician Levent Alpöge published a formal proof of the Riemann hypothesis using Claude; Lean FRO and the Mathlib Initiative independently confirmed that the formal proof is logically valid and matches the formalized statement. Explain Lean FRO / Mathlib in one line or skip them. Do not claim we covered it.
  Explain for a general reader what VP vs VNP means only if the article supports it; the candidate facts do not define it, so keep the explanation to "a long-open problem in computational complexity" only if heise says so, else say "a 1979 math problem". Do not add unsourced math explanations.

- 제약: Facts only from the heise article above (single source; say so in the caption, "reported by heise online"). Attribute every claim: "Anthropic says", "OpenAI says", "is said to solve". Never write "solved" or "proved" as established fact. Translate German ourselves and label "our translation" for any quote. No real-person photos (do not depict Alpöge or any mathematician); no logos; no text inside the cover image. Follow DESIGN.md (1080x1350, accent one word, cover title max 2 lines of 16 chars, tag format `GLOBAL AI · RESEARCH`). Source slide and caption must name heise online and the article title. Daily Higgsfield credit budget per config/budget.yaml applies. No reader-impact hook unless the article gives one (it does not): write "No reader-impact hook:" in hook_pick_reason.

- 질문 기준: Flag, do not guess: (a) what VP != VNP means in plain words, since the candidate facts do not define it; (b) whether the English heise version says anything different; (c) the exact Anthropic-vs-OpenAI timing ("a few hours": do not give hours or time zones); (d) whether the Riemann context is worth a slide given it is not in our posts; (e) any hook that implies the proofs are confirmed or that AI "beat" mathematicians. Anthropic appeared in 2026-11-19-anthropic-ant-debut (different angle) and OpenAI in 2026-11-23-openai-perplexity-speed-limit; the evening run should avoid both companies if possible, since this post is about both.

## Runner-up order (also saved in posts/_backlog/2026-11-25-morning-runners-up.md)
1. Z.ai GLM-5.4 looped transformer (CHINA AI · MODELS), score 8 (global 3 + numbers 2 + Asia 3), but single Korean source (AI타임스 217728), vendor self-reported benchmarks with no third-party comparisons, technical. Good fallback if VP != VNP is blocked.
2. OpenAI and Anthropic staff debate halting training of strongest models (AI타임스 217755, citing Axios, 24+ sources), score about 6 (global 3 + number 2 + weak Korea-outlet 1 at most). Axios not read, so hard to fact-check; both companies overlap with the pick.
3. Tidal deleting about 29M AI songs from Dec 9 (TechCrunch + TNW), score 5 (global 3 + numbers 2). Two sources, readable consumer story, good evening candidate (Block, not Anthropic/OpenAI). Note TechCrunch body has been unreadable via article.mjs; TNW is.
4. Anthropic Siren sandbox test (TNW), score 5. Same company as pick.
5. OpenAI GPT-6 protein design (OpenAI newsroom original), score 5. Same company as pick.
6. Google Workspace agent gateways from Feb 1, 2027 (TNW), score 5.
7. Epochal (xAI co-founders), Walmart x Meta Muse (-5 for Meta overlap), lower.
