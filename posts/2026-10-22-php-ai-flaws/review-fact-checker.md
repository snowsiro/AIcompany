FAIL

Both sources opened with scripts/article.mjs (TechCrunch Oct 21, 2026; AI Times Oct 22, 2026). I checked the text in post.json (cover, slides, caption, threads_caption) and slide 07.jpg. I did not open slide images 01-06, so I did not check that they match post.json.

Issues

1. Slide 5 title, "Early attempts, no breaches" (overstated). Neither article says there were no breaches. AI Times says the scale of actual intrusions and data leaks is "not yet confirmed" (실제 침입이나 데이터 유출 등 피해 규모는 아직 확인되지 않았다). TechCrunch only says there were "no reports of exploits in the wild". The slide's own body also says Cloudflare saw attack attempts.
   Fix: use "Early attempts, no confirmed exploits" or "Attack attempts seen, no confirmed damage".

2. Slide 5 body and caption, "OpenAI says ... no exploits seen in the wild" (attribution stretch). TechCrunch attributes only "found by researchers before hackers discovered them" to OpenAI. The "no reports of exploits in the wild" part is TechCrunch's own conclusion ("So there were no reports..."). AI Times says CISA had not confirmed exploitation as of the announcement. The same wording sits in facts[6] and the caption bullet.
   Fix: write "No exploits had been reported in the wild at publication (TechCrunch); OpenAI says researchers found the flaws first." Alternatively attribute the no-exploit point to CISA, per AI Times, and keep Cloudflare's "initial attack attempts".

3. Slide 2 and caption, "software behind roughly 70% of websites" (minor). TechCrunch says "powers roughly 70% of the websites on the internet", so the wording matches it. AI Times qualifies this as about 70% of sites whose server-side language can be identified. This is acceptable as written. Consider "roughly 70% of sites with a known server language" if you want to be exact.

4. Slide 1 and caption (minor context, not a mismatch). AI Times says these outages were mostly precautionary, and Germany and Finland said so; Finland said it was not responding to exploit attempts or a data leak. Slide 1's "sites went dark" and the cover "SITES DOWN" are accurate, but nothing says the shutdowns were precautionary. This pairs with issue 1, so a reader could infer attacks caused the outages.
   Fix: add "as a precaution" to slide 1.

Checked and matching

- Slide 1: Netherlands (government portals, Port of Rotterdam, football association, several hospitals), University of Freiburg, University of Vienna.
- Slide 2: NSA warning, two critical holes, every version since PHP 5 (2004), PHP2Shell, 9.2 out of 10 each.
- Slide 3: Calif, GPT-5.6 Sol, "Patch the Planet", Wiz's AI agent, Gemini 4 Argon, one researcher did in a week what a world-class team would need months for. "Owned by Google" matches "Google's Wiz" and "Alphabet subsidiary".
- Slide 4: quote is verbatim from TechCrunch and correctly attributed to Wiz (its blog).
- Slide 5: NSA advises taking PHP sites offline if they cannot be patched immediately; Cloudflare saw initial attack attempts; Censys counted 1.5M of about 2.6M hosts on versions that cannot easily get the fix.
- Cover hook and hook_pick_reason are supported by the body.
- Slide 07 and caption cite outlet, title and date for both sources, and these match the articles (TechCrunch Oct 21, 2026; AI Times Oct 22, 2026, KST).
- Threads caption: facts are fine; it gives the outlet and title only, which is acceptable.
