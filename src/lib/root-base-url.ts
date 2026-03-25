/**
 * Root origin for absolute SEO URLs (sitemaps, discovery links).
 * Set PUBLIC_ROOT_BASE_URL at build time if the live host differs.
 */
export function getPublicRootBaseUrl(): string {
  const raw = import.meta.env.PUBLIC_ROOT_BASE_URL?.toString().trim();
  const base = raw && raw.length > 0 ? raw : "https://wordok.top";
  return base.replace(/\/$/, "");
}
