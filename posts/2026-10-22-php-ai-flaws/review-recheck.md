PASS (re-check by Claude, 2026-10-22, after 제이미 asked to fix this post)

The second fact-check round failed on slide 5's wording. Fixes:
1. Slide 6 title "Early attempts, no breaches" is now "Attack attempts, damage unclear". AI Times says the scale of
   intrusions or data leaks is not yet confirmed (피해 규모는 아직 확인되지 않았다), so "no breaches" overstated it.
2. Slide 6, caption, Threads caption and facts: OpenAI is now credited only with "found by researchers before hackers"
   (TechCrunch's wording). The "no exploits in the wild" line was TechCrunch's own conclusion, so it is dropped from the slide.
3. Slide 2 and caption: shutdowns were partly precautionary (AI Times: 예방 조치), so the post now says "some were
   precautions" so readers don't infer attacks caused every outage.

How it was checked: check-article on a GitHub runner (TechCrunch 759 words, AI Times 524 words). Found in TechCrunch:
before hackers, found by researchers before hackers, no reports of exploits in the wild, roughly 70%, National Security
Agency, since version 5, 2004, Calif, Patch the Planet, GPT-5.6 Sol, Gemini 4 Argon, the Wiz quote. Found in AI Times:
예방 조치, 피해 규모는 아직 확인되지 않았다, 침입, 데이터 유출, 클라우드플레어, 공격 시도, 초기 공격, 센시스, 150만, 260만,
로테르담, 프라이부르크, PHP2Shell, 9.2, 일주일, 병원. Cloudflare and Censys figures come from AI Times only (not in TechCrunch).

Lint passes (slide 6 trimmed to 48 words). Hook (7/10) and brand safety passed in round 2; the cover is unchanged.
No new credits used.
