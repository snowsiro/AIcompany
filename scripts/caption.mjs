// Reads the parts of a post's caption. The caption is the reviewed text, so other scripts reuse it as it is:
// hook line, a context paragraph, → bullets, a question, Source line, follow line.
// Used by site.mjs (link page, newsletter digest), weekly.mjs and lint.mjs (weekly roundup).
export function parts(p) {
  const lines = (p.caption || "").split("\n").map(l => l.trim()).filter(Boolean);
  return {
    hook: lines[0] || "",
    context: lines.slice(1).filter(l => !l.startsWith("→") && !/\?$/.test(l) && !/^(source:|follow )/i.test(l)),
    bullets: lines.filter(l => l.startsWith("→")).map(l => l.replace(/^→\s*/, "")),
    source: p.sources?.[0],
  };
}
