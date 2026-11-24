# Fact review: 2026-11-24-nvidia-huang-ceo-reinstated

Verdict: FAIL

Source opened with scripts/article.mjs: Nvidia Newsroom release (title matches exactly). Cover, slides 1-5, caption and facts match the article text. Two issues remain.

## Issues
1. threads_caption: "is confident there is no national security risk" is broader than the release. The release says the Board is confident "Mr. Huang's reinstatement poses no national security risk". Fix: "is confident Huang's reinstatement poses no national security risk."
2. Date "Nov 23, 2026" (sources[0].date, caption): article.mjs printed an empty `published:` field. WebFetch reported the date only as a summary, so I could not read it in the article text. It is unconfirmed. Fix: confirm the date from the page, or drop the date from the caption and sources.

## Checked OK
- Unanimous vote, effective immediately, President/CEO/Board member
- Candor and ability to lead
- Input from senior levels of the US government
- Jones remains chair; Kress thanked as interim CEO and continuing CFO
- Independent-director committee investigating reporting of a foreign intelligence effort; investigation to proceed to conclusion; Huang committed to cooperating
- National Security and Export Control Committee; Chief Compliance Officer search
- No unsupported claims on the cover. All lesser-known names are explained by the release context.
