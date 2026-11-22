# Brand-safety review: 2026-11-22-korea-csat-minister-resigns

**Verdict: PASS**

| Check | Result |
| --- | --- |
| Cover shows no real person, recognizable logo or readable text | Pass. `cover.png` is an AI-generated empty exam hall with one generic smartphone and yellow rings. No people, no text, no logo. |
| Nothing copied from a reference account | Pass. `korean_refs` is empty. The wording is original and sourced from the articles. The image is generated. |
| Original outlet credited in caption and `threads_caption` | Pass. The caption names The Korea Herald in the body and in the closing Source line, and also lists The Express Tribune with titles and dates. `threads_caption` ends with "Source: The Korea Herald" and the article title. |
| Source on last slide | Pass. The template builds the last slide's source block from `sources` (both outlets, titles, dates). |
| No affiliate, referral or tracking links, no sponsored-tool mention | Pass. No URLs in the slides, caption or `threads_caption`. The "link in bio" line is the standard weekly-digest pointer. |
| Colors and fonts match DESIGN.md | Pass. `templates/card.html` uses only the DESIGN.md palette, Anton and Inter Tight. The post adds no custom styling. The cover tag `KOREA AI · POLICY` is valid. Headline lines are within 16 characters. |
| Tone | Pass. The tone is neutral and factual and does not mock any person, company or country. The caption marks the 10-year ban as a proposal ("these are proposals, not law"). |
| Hook supported by slides | Pass. "111 CAUGHT. A MINISTER QUITS" is backed by slides 2 and 4. The wording does not claim AI cheating caused the resignation, and slide 1 says he took responsibility for the confusion from the last-minute changes. |
| Global-reader explanations | Pass. Suneung/CSAT, Cheong Wa Dae ("the presidential office") and the ruling Democratic Party of Korea are explained or clear in context. Won amounts are given with dollars ($75,000). The tax accountant exam topper is not named. |

## Minor notes (non-blocking)
- The caption's first line says the minister resigned "after AI-cheating fears overshadowed" the exam. This is acceptable because the next paragraph gives the exact stated reason.
- Real people named (Choi Kyo-jin, Lee Jae Myung) appear in text only, taken from the sources. There is no likeness anywhere.
