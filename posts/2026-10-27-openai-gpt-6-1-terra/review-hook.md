# Hook review (round 3): PASS, score 7/10

Chosen hook: "OPENAI'S **TERRA** / RUNS A COMPUTER" (index 3, labeled claim). Checked on the new render `slides/01.jpg` and on `slides/02.jpg`.

## Scores (chosen)
- Clear in 2 seconds: 8. A known name first, then five plain words. The image (a cursor moving between windows) backs up "runs a computer". "Terra" is unknown, but "OpenAI's" tells you it's an OpenAI product.
- Curiosity: 6. "An AI that runs a computer" will pull in a general reader. But Terra replaces an earlier Terra (slide 2), so this isn't what's new. What is new (half price, better for less) isn't on the cover.
- Concrete number or name: 9. OpenAI and Terra. No number.
- Promise kept: 8. Slide 2's title repeats the claim ("OpenAI's new model runs a computer") and its body backs it up (click, type, move between apps). The yellow TERRA on the cover matches the yellow "GPT-6.1 Terra" on slide 2. The cover never says computer use is new, so nothing is overstated.
- Reader stake: 4. Nothing about "you". That's fine, since it's strong on the rest.
- Render: clean. 14 and 15 characters per line (max 16), one accent word, nothing cut off.

## Labels
All four are honest.
- 0 number: rests on a ratio ("half"), not a figure. Loose but acceptable.
- 1 reader-impact: really is about the reader ("for you"). But "cheaper" is the per-token API price, not something the slides show a ChatGPT subscriber saving.
- 2 number: a real figure.
- 3 claim: a plain statement. `hook_type` matches `hook_types[3]`, and `headline` matches `hook_options[3]`.

## Options compared
- 0 "HALF THE PRICE, / AI RUNS **APPS**": about 6. Names no one and reads as if apps are half price.
- 1 "CHEAPER AI THAT / **CLICKS** FOR YOU": about 6. Clear and personal, but no name or number, and the "cheaper" payoff is thin for most readers.
- 2 "$1 PER MILLION / TOKENS FOR **AI**": about 4. "Tokens" is jargon, it quotes only the $1 input price (output is $5), and it hides what the model does.
- 3 (chosen): 7. The best of the four.

## Minor (not blocking)
- `hook_pick_reason` counts options from 1: its "option 1" is the old headline and its "option 3" is the tokens hook. `better_option` and these reviews count from 0, where index 3 is the Terra hook. Quote the hooks to avoid confusion.
- The round-2 slide-number error is fixed (the price is on slide 3).
