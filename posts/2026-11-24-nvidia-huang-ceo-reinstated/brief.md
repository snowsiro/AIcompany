# Brief: 2026-11-24-nvidia-huang-ceo-reinstated (evening run retry, post 20:57)

- 결과: One 7-slide English carousel. Tag `US AI · BUSINESS` (REGION US; writer may use another CATEGORY word already used in earlier posts). Angle: "Nvidia's board brings Jensen Huang back as CEO, and says it checked with the US government first." The story is the board's own account: a unanimous vote, government input, an investigation, and new oversight (two committees and a new Chief Compliance Officer search). Single source, so attribute every claim ("Nvidia says", "the board said"). NO generated cover: Higgsfield credits for today are spent, so the designer uses the template's fallback graphic background (line-to-ink gradient, accent glow, grid). No image generation, no real-person photo, no logo.
- 맥락: Nvidia is the most valuable chip company and sets the pace of AI hardware, so who runs it matters to anyone following AI. Facts that carry it (all from the Nvidia Newsroom release): the Board voted unanimously to reinstate Mr. Huang as President, CEO and Board member, effective immediately; the Board received input from senior levels of the US government and, based on it, says it is confident the reinstatement poses no national security risk; Harvey Jones stays Board chair; Colette Kress, who was interim CEO, keeps her CFO role; an independent-directors committee will investigate reporting that Mr. Huang has been the target of a foreign intelligence effort, and he is committed to cooperating; a National Security and Export Control Committee of independent directors is formed; Nvidia starts a search for a new Chief Compliance Officer. Nvidia posted 11-18 (China exit) and 11-23 (Nasdaq bear market) in the last 14 days, but those were different stories, so this is not a repeat of the same topic.
- 제약: Facts only from the one source below (Nvidia Newsroom, 2026-11-23). Do NOT use TechCrunch, Megaspeed, Alice Huang, Trump, Semafor, Commerce Department or Entity List facts, and do not use "11 days after he left" or "ousted" (not in the release; say "reinstated"). Quote or closely paraphrase the release only. Keep "reporting that" wording for the foreign-intelligence line (the Board is investigating reporting, not confirming it). Keep "the Board is confident" wording for the national-security line (it is the Board's view, not a finding). Source slide and caption: Nvidia Newsroom, "NVIDIA Board Reinstates Jensen Huang as President, CEO and Board Director" (2026-11-23). Single-source story; the fact-checker should read the Nvidia Newsroom page. No real-person photos (Huang, Kress, Jones), no big real logos, DESIGN.md applies.
- 질문 기준: Flag, don't guess, if: (a) a hook implies Huang did something wrong, or that the investigation found anything; (b) a hook or slide says why he left or how long he was out; (c) any fact needs a second source (a second readable outlet was not confirmed; add Reuters or Nikkei only if the text is actually read by `node scripts/article.mjs`); (d) the cover wording needs an image to carry it (there is none); (e) a reader-impact hook cannot be tied to the release: the release has no everyday-reader impact, so write "No reader-impact hook:" in `hook_pick_reason`. Cover hook ideas: claim ("HUANG IS BACK AS NVIDIA CEO"), number ("1 VOTE, 0 AGAINST" only if "unanimously" is stated as unanimous, not as a count), quote-style from the release ("NO NATIONAL SECURITY RISK" attributed to the Board). Avoid "SCANDAL", "OUSTED", "SPY".

## Sources (use these only)
1. Nvidia Newsroom, "NVIDIA Board Reinstates Jensen Huang as President, CEO and Board Director" (2026-11-23): https://nvidianews.nvidia.com/news/nvidia-board-reinstates-jensen-huang-as-president-ceo-and-board-director

## Facts to use (all from source 1)
- The NVIDIA Board of Directors voted unanimously to reinstate Mr. Huang as President and Chief Executive Officer and as a member of the Board, effective immediately.
- In reaching its decision the Board received input from senior levels of the United States government; based on that input, the Board is confident that Mr. Huang's reinstatement poses no national security risk.
- Harvey Jones will remain as Board chair. The Board is grateful to Colette Kress for her service as interim CEO, in addition to her continuing responsibilities as NVIDIA's Chief Financial Officer.
- The Board formed a committee comprised solely of independent directors to investigate reporting that Mr. Huang has been the target of a foreign intelligence effort; the investigation will proceed to conclusion and Mr. Huang is committed to cooperating.
- The Board also formed a National Security and Export Control Committee of independent directors, and NVIDIA is commencing a search to fill a new position, Chief Compliance Officer.

## Things to avoid
- Google/DeepMind (morning company), Meta Muse (blocked), OpenAI (posted 11-23).
- Any fact not listed above (no market cap, no share price, no Megaspeed, no SK hynix move, no dates of the departure).
- Absence claims such as "the release does not mention X".

## Score (config/sources.yaml scoring)
| Item | Pts |
| --- | --- |
| covered_by_reference_accounts (ai.trend.kr 4.7x, one account; evening has no fresh ref data) | 3 |
| global_relevance | 3 |
| has_hard_number (unanimous vote, dates; modest) | 2 |
| korea_asia_europe_angle | 0 |
| same_company_as_other_pick (morning was Google DeepMind) | 0 |
| already_posted_last_14_days (Nvidia posted twice, different angles; not counted as same topic) | 0 |
| fresh_within_6h_evening (released 11-23, carried over) | 0 |
| **Total** | **8** (would be -2 if a strict reading counted the Nvidia posts as repeats) |

Selection note: Nvidia is the next-best readable candidate after the blocked Meta Muse. GPT-6.2 Sol (AI타임스, readable) scored about 5 and OpenAI posted 11-23; Sierra, Decart and Claude Ship are TechCrunch-only (unreadable). Not new today (carried over), but the playbook allows the best carried-over story when nothing new is available. Risk: stale (11-23) and Nvidia-heavy week; the editor accepts it because it is the only readable story that is not Google or a blocked one.

## Runner-ups (for posts/_backlog/)
GPT-6.2 Sol (AI타임스, readable, 5); Sierra $30B (TechCrunch only); Amazon-Decart $7.5B (TechCrunch only); Claude Ship (TechCrunch only).
