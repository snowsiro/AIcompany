PASS (re-check by Claude, 2026-10-21, after 제이미 asked to fix this post and generate its missing cover)

The second fact-check round failed on four wording points. All four are fixed:
1. Slide 6 and caption: the forecast is now "SpaceX's annual recurring revenue", as the article says, not the AI segment's.
2. Caption typo "will hit of" is gone ("will be $500B to $1T").
3. Slide 2 and caption: "Bitcoin gains" is now "the recovery of Bitcoin prices".
4. Slide 4: "heavy-lift" is dropped; the slide now says SpaceX "invests more in its Starship rocket".

How the article was checked: WebFetch summaries of this page disagreed with each other (one returned a short early
version without most of the figures), so the article was read on a GitHub runner with `scripts/article.mjs`
through the `check-article` workflow (872 words, published 2026-10-20T20:40:41Z). Every figure and name in the post
was found in the article text: 14.6 billion, third-quarter revenue, regulatory filing, on Tuesday, 52% of its income,
Super Intelligence, 7.5 billion, recently acquired Cursor, Grok, neocloud, income related to the recovery of bitcoin
prices, unspecified related-party income, 431 million, 1.2 billion, stock-based compensation, 19.6 billion,
second data center project, increase investment in Starship, bullish, predicting, Johnsen, 35 billion, 40 billion, new capital
investments in the fourth quarter, 4.4 billion, turnaround from, 413 million, first nine months, "somewhere between
$500 billion and $1 trillion", SpaceX's annual recurring revenue, end of 2027, 13.6 million, leaves its roots as a
space company behind to focus on artificial intelligence. Slide 6 now says Starlink "serves 13.6M consumers", the article's word (it has "13.6 million consumers", not "Starlink subscribers").

Cover: new image (cinematic_studio_2_5, 2 credits over the daily cap, approved by 제이미). Plain rocket and server
racks at dusk; checked on the rendered slide 01 for people, logos, letters and contrast behind the headline.
Hook and brand safety passed in round 2; the hook and the slides it points to are unchanged.
