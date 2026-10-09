/** Keep document title near SERP-friendly length (~60 chars including site suffix). */
export function buildPostDocumentTitle(
  postTitle: string,
  siteName: string,
  maxLen = 60,
): string {
  const suffix = ` - ${siteName}`;
  const full = `${postTitle}${suffix}`;
  if (full.length <= maxLen) return full;

  const ellipsis = "…";
  const budget = maxLen - suffix.length - ellipsis.length;
  if (budget < 12) {
    return `${postTitle.slice(0, maxLen - ellipsis.length)}${ellipsis}`;
  }
  const trimmed = postTitle.slice(0, budget).replace(/\s+\S*$/, "").trim() || postTitle.slice(0, budget);
  return `${trimmed}${ellipsis}${suffix}`;
}
