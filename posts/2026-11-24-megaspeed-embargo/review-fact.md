FAIL

Sources opened: heise online (node scripts/article.mjs, full text read). Nvidia Newsroom (article.mjs returned the text but an empty "published:" field).

Issues
1. Slide 6, facts[7], sources[1] date, caption: "on 23 Nov" / "Nov 23, 2026". The article text has no date. Only a WebFetch summary showed "November 23, 2026", and that is unconfirmed. Fix: drop the date from slide 6, the caption and the sources entry, or confirm it from the page itself. The text says only "today announced".
2. Slide 5: "built on US technology" drops heise's "certain" ("auf bestimmter US-Technik beruht"). It reads broader than the source. Fix: "built on certain US technology". Note that heise also says goods already in transit may still be delivered.

Verified against heise (all match):
- Seven companies in Singapore, Thailand and Malaysia.
- Embargo applies from Wednesday.
- Six of the seven form Megaspeed; the seventh is Apex Enterprise Solutions, an Alibaba subsidiary.
- Apex "soll" have provided the billions that Megaspeed used to buy Nvidia chips from June 2024.
- Megaspeed hosts the chips in data centers and rents them out, especially to customers in China (an allegation).
- Nvidia stopped selling restricted chips to Megaspeed in June 2025.
- The Justice Department is probing chip smuggling.
- Megaspeed says it opened an internal investigation.
- The Commerce Department notice puts the seven firms on the EAR blacklist.
- heise gave Alibaba a chance to comment, and no reply is printed.
- The title and title_en are faithful.
- The Nvidia content (board voted unanimously to reinstate Huang as CEO) matches.
- The cover, the caption and threads_caption are hedged correctly apart from the date point above.
- Slide images were not inspected.
