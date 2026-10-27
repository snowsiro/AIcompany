# Hook review: 2026-10-27-cohere-qwen-phone-home

Verdict: PASS
Score: 7/10
Chosen hook: "QWEN SPYING? / NO PROOF YET" (myth-flip). Best of the four options.

## Scores
- Clear in under 2 seconds: 8. Short, big type, one question and one answer.
- Curiosity: 7. The question raises the spying angle and "YET" implies more to come. It gives away the verdict, so the pull is slightly lower than a pure open loop.
- Concrete number or name: 6. It names Qwen and has no number. Cohere, Beijing and the file upload appear on slide 02.
- Promise kept by the slides: 9. Slides 03-05 cover this directly: Cohere can't say if it was deliberate, researchers call it messy training, critics say the probing steered the model, and one skeptic found no backdoor.
- Reader stake: 4. The hook is about a controversy, not about what changes for the reader. This is acceptable because the other scores are strong and no stake is promised.

## Other options
- 0 "QWEN TRIED TO UPLOAD A FILE" (claim): concrete and punchy, but it drops the "no proof" nuance and reads closer to an accusation. Its score would be about 6.
- 2 "COHERE VS ALIBABA'S QWEN" (rivalry): vague, and it frames the story as a vendor fight. Slide 06 covers Cohere's stake, but that is not the core story. About 5.
- 3 "USING QWEN? NO BACKDOOR SEEN" (reader-impact): see the label issue below. About 5.

## Issues
1. hook_types[3] "reader-impact" is only half honest. It addresses the reader with "USING QWEN?", but the slides say nothing about what users should do or whether they are affected. hook_pick_reason admits this. "NO BACKDOOR SEEN" also leans on one early skeptic, so it overstates the evidence. The label is better as "reader-address", or the option should be dropped.
2. hook_types[1] "myth-flip" is acceptable. The hook flips a suspicion rather than a widely held myth, so "question-answer" would be more exact. This is minor.
3. Cover wording "NO PROOF YET" is accurate. Slide 02 states "tried to reach Beijing" without a hedge, but slide 03 qualifies it right away. Keep the order of the slides as it is.
4. There is no real stake. If an angle for it exists, add it to a slide before using it in a hook, for example what developers running Qwen can check themselves using the reproduction script on slide 05.
