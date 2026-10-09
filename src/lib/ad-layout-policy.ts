/** Site-wide contact for portal / legal pages (AdSense & support). */
export const PORTAL_CONTACT_EMAIL = "iwangzhanpeng94@gmail.com";

const ROOT_POLICY_PATHS = new Set([
  "/privacy/",
  "/about/",
  "/contact/",
  "/tools/privacy/",
  "/tools/about/",
  "/tools/contact/",
]);

const SITE_POLICY_SEGMENT = /\/(about|contact|privacy)\/$/;

/**
 * Legal / policy pages should not get layout-level ad min-height reserves
 * (Auto ads may still apply per AdSense policy; we avoid extra CLS placeholders here).
 */
export function shouldSuppressAdReserves(pathname: string): boolean {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  if (ROOT_POLICY_PATHS.has(normalized)) return true;
  if (SITE_POLICY_SEGMENT.test(normalized)) {
    const first = normalized.split("/").filter(Boolean)[0];
    if (first && !["tools", "sitemap", "relay", "sbti"].includes(first)) {
      return true;
    }
  }
  return false;
}
