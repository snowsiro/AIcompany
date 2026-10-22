PASS

Both sources were opened with scripts/article.mjs. The AI Times headline was cut off in that output ("앤트로픽, 메타"), so I confirmed the full headline with WebFetch. It matches post.json exactly.

Checked against the articles (all match):
- Cover and slide 1: research preview, proactive agent, background work, asks before acting (TestingCatalog).
- Slide 2: US Claude Pro and Max subscribers, waitlist, included in those plans, shared usage limits (both articles).
- Slide 3: morning brief from connected apps, checks accounts every few hours, a virtual machine with its own browser keeps working when devices are off (both articles).
- Slide 4: must show the action and wait before sending, paying, signing or deleting. Securities trading and account transfers are prohibited (both articles).
- Slide 5: may misread threads or rank urgency poorly, and users cannot yet view the browser (both articles). The Muse and Dots competition claim is attributed to AI Times, which says it in its lead paragraph.
- facts[] entries, including the 6,000 connectors and plugins and the Gmail, Slack, QuickBooks, Stripe, HubSpot and Shopify list (both articles).
- Source dates: TestingCatalog was published 2026-10-21 and AI Times 2026-10-22, matching "Oct 21, 2026" and "Oct 22, 2026".
- Outlet, article title and date appear on slides/07.jpg and in the caption, as CLAUDE.md requires.

Minor notes (not failures):
1. Slide 2: "Readers outside the US cannot sign up yet" is an inference. The articles only say access is for US subscribers. It is a reasonable reading and not overstated.
2. threads_caption names TestingCatalog with its title but gives only "AI Times" with no title or dates. CLAUDE.md requires title and outlet in the caption, which the Instagram caption satisfies. Consider adding the AI Times title to the Threads caption if the rule is meant to cover it.
3. Slide 2 omits that the app is separate from the main Claude app. This is not a claim error.
