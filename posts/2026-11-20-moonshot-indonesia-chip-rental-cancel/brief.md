# Brief: 2026-11-20 evening, id `2026-11-20-moonshot-indonesia-chip-rental-cancel`

SINGLE-SOURCE WARNING: the only article is AI Times (Korea, in Korean), which cites The Information. Facts below are English renderings of the Korean text. The Information and the US Commerce Department rule text were not read. Writer must attribute "The Information reported" and label it as reported, not confirmed by Moonshot or Nvidia. Last slide and caption source: AI Times (Korea), "문샷 AI, 미국 수출 규제에 2000억 규모 엔비디아 칩 임대 계약 취소" (2026-11-20), https://www.aitimes.com/news/articleView.html?idxno=217613 . Original-language title may be kept as is; add an English gloss.

## Score (config/sources.yaml scoring)
Run started 18:15 UTC. fresh_within_6h_evening applies only to stories first published after 12:15 UTC. None of today's candidates qualify (latest is Nvidia 10:42Z), so nobody gets +2. Moonshot first published 05:07Z.

| Story | Rel | Number | Asia/Eur | Fresh | Penalty | Total |
| --- | --- | --- | --- | --- | --- | --- |
| **Moonshot cancels $150M Nvidia rental (AI Times)** | 3 | 2 | 3 | 0 | 0 | **8** |
| Deutsche Telekom EUR 100M into Mistral (Der Standard) | 3 | 2 | 3 | 0 | 0 | 8 but only 3 facts, rejected as thin |
| OpenAI API 30/40% batch-style discount (AI Times) | 3 | 2 | 0 | 0 | 0 | 5 |
| OpenAI Performance Factory (AI Times) | 3 | 2 | 0 | 0 | 0 | 5 |
| Gemini 4 Neon (Google, carried) | 3 | 2 | 0 | 0 | 0 | 5 |
| Google Suncatcher / Blue Origin (AI Times, borderline) | 3 | 2 | 0 | 0 | 0 | 5 |
| Google Mirror Dimension (heise only) | 3 | 2 | 0 | 0 | 0 | 5 |
| Meta Muse Charm $300 (TechCrunch, carried) | 3 | 2 | 0 | 0 | 0 | 5 |
| Gemini computer use on Mac | 3 | 0 | 0 | 0 | 0 | 3 |
| Apple Mac agent | 3 | 0 | 0 | 0 | 0 | 3 |
| Genie 4 rollout | 3 | 0 | 0 | 0 | 0 | 3 |
| Nvidia / California subpoena (TNW) | 3 | 2 | 0-3 | 0 | -10 (Nvidia China 11-18) | -5 to -2 |
| Microsoft Office in Copilot | 3 | 2 | 0 | 0 | -10 (Nadella 11-19) | -5 |
| Anthropic founders cash out | 3 | 2 | 0 | 0 | -10 (Anthropic IPO 11-19) | -5 |

Reference-account points are 0 for all (no data in the evening run). Moonshot is the only story that clears 6 with a non-US angle, a hard number and enough facts. Nothing scores 6 or more from the US list, so no carried-over fallback is needed.

Repeat check: posts/2026-11-16-us-remote-access-chip-rule covered the rule itself (within 14 days). This is a different event, the first named company reported to react, so no -10 was applied. Writer must not re-explain the whole rule; one line of context is enough, and the post must lead with Moonshot, not the rule. If the fact-checker or Jamie reads it as a repeat, flag it. Different company and lead outlet from the morning post (Dutch regulator, heise).

## 결과
Make a 7-slide carousel: Moonshot AI pulled out of a $150M Nvidia chip rental in Indonesia after a new US rule on remote chip access, and froze other GPU rental talks. Tag: `CHINA AI · POLICY` (center of the story is a Chinese company; Indonesia and the US are the setting). Suggested hook types: number ($150M) or claim. No reader-impact hook unless the article supports it (it does not; write "No reader-impact hook:" in hook_pick_reason).

## 맥락
Angle: US chip controls now reach through the cloud. Renting Nvidia chips in a third country was the workaround, and the first named casualty is Moonshot AI, the Chinese startup behind the Kimi models. A reader anywhere cares because it shows where the AI race for compute is getting squeezed, and Southeast Asia data centers are caught in the middle. Facts to carry it (all from AI Times, article 0):
1. Moonshot AI cancelled a $150 million (about 200 billion won) deal to rent Nvidia's latest AI chips through an Indonesian data center.
2. The Information reported on the 19th (US time), citing multiple sources, that Moonshot withdrew from the Blackwell Ultra B300 rental deal with a Southeast Asian neocloud company.
3. Moonshot had reportedly accepted paying 50% of the contract up front; the usual prepayment ratio is about 15%.
4. The trigger is a new US Commerce Department rule announced on the 16th and in force from the 19th.
5. The rule requires overseas data centers serving Chinese customers above a certain size to get US government permission.
6. Data centers already serving Chinese firms above that size must get a US licence within 90 days; the threshold is compute equal to about 300 of the latest AI chips.
7. Moonshot has also paused negotiations on other new GPU rental deals while it reviews the rule's impact.
8. Moonshot's K3 model, released in July, drew attention for performance comparable to major US models; it was seeking more GPUs for its next model, Kimi K4.
Explain on first mention: Moonshot AI (Chinese AI startup, maker of Kimi), neocloud (a company that rents out AI chips in the cloud), Blackwell Ultra B300 (Nvidia's latest chip generation as the article calls it). Currency: $150M (about 200 billion won, per the article).

## 제약
Facts only from the AI Times article above. Do not add anything from the 11-16 post or other sources unless the writer finds and lists a second readable article. No real-person photos or likenesses; no logos large; AI-generated image only, no text in the image (DESIGN.md). Do not name the Indonesian data center or the neocloud company (not in the article). Do not state that the rule is aimed at a specific country beyond "Chinese customers", and do not call Moonshot's pause permanent.

## 질문 기준
Flag instead of guessing: (a) anything that depends on The Information's report that AI Times does not quote, such as the 50% versus 15% prepayment (attribute to the report, say "reportedly"); (b) the date "19th (US time)" versus "in force from the 19th", write dates explicitly with the month only if the article date supports it; (c) whether "about 300 of the latest AI chips" is the right wording for the threshold; (d) the 90-day licence deadline, which applies to data centers already serving Chinese firms; (e) the Kimi K4 / K3 claims, which are the article's description, not verified benchmarks; (f) if the fact-checker cannot confirm single-source facts, drop them rather than soften them.
