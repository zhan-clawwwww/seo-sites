/** Affiliate / referral URL 含占位符时视为未配置 */
const PLACEHOLDER_RE = /REPLACE_|YOUR_[A-Z0-9_]+|PLACEHOLDER/i;

export function isUsableAffiliateUrl(url: string | undefined): boolean {
  if (!url) return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) return false;
  return !PLACEHOLDER_RE.test(trimmed);
}
