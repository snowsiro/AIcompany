# Fact review: FAIL

Source opened with scripts/article.mjs (AI타임스, idxno=217039). Headline confirmed via WebFetch: "텐센트, 'Hy4'로 중국 AI 최상위권 진입 선언…사이버 공격 학습 제한". title_en is faithful.

## Issues
1. Slide 3 (kicker "Tencent's test", body "This is **Tencent's own test**, not an outside one"), facts[4], caption ("Tencent's own finance test ... that test is Tencent's"), cover pick reason: the article never says who ran the 579-task / 213-expert finance evaluation. It only says "실제로 금융 전문가 213명이 참여한 579개 실무 과제 평가에서는 Hy4가 3.04점...". Calling it Tencent's own test is an inference, so it is unconfirmed. Fix: drop the ownership claim. Say "On a 579-task finance evaluation with 213 finance experts, as reported by AI타임스" and change the kicker. In the caption use "a finance evaluation cited alongside Tencent's claims". Or find a source that states who ran it.

## Verified OK
Nov 4 release; 770B total / ~49B active / 1M context; first image understanding; CLI+GUI computer use; defensive security data, attack material excluded; scores 3.04 / 2.97 / 2.68 / 2.68; Vals AI 59.35%, 13th of 33, 4th open-weight, Kimi 62.52, DeepSeek 61.26, GLM-5.3 59.73 (Nov 4); gaps in research-level math, long coding, self-improvement, advanced visual Q&A; weights not yet released, system card and Hy4 Flash planned; the "top tier" declaration matches the headline. "China's largest social media and gaming company" is plain background, allowed.
Note: "Tencent declared top tier" is the headline's framing, and the body says "on par with top Chinese open-weight models". This is acceptable.
