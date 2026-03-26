/**
 * 全站专栏短标签与文案（与首页 columnMeta.label 对齐）
 */
export const CHANNEL_LABELS: Record<string, string> = {
  "vpn-usa": "VPN",
  ai: "AI News",
  apple: "Apple",
  streaming: "Streaming",
  web3: "Web3",
  "site-a": "Tech Guides",
  tesla: "Tesla",
  openclaw: "OpenClaw",
};

/** 顶栏 / 面包屑：当前站文章列表链接文字 */
export function postsNavLabel(slug: string): string {
  if (slug === "apple") return "Products";
  if (slug === "openclaw") return "Guides";
  return "News";
}

/** 页脚 Explore / HTML 站点地图：posts 入口展示名 */
export function postsHubLabel(slug: string): string {
  if (slug === "apple") return "Products";
  if (slug === "openclaw") return "Guides";
  return "Articles";
}

/** Strip query, trailing slash, and index.html for route comparison */
export function normalizePathname(pathname: string): string {
  const raw = pathname.split("?")[0] || "/";
  const noIndex = raw.replace(/\/index\.html?$/i, "");
  if (noIndex.length > 1 && noIndex.endsWith("/")) {
    return noIndex.slice(0, -1);
  }
  return noIndex || "/";
}

/** Match nav link: exact (e.g. site home) or prefix (e.g. /site/posts/...) */
export function isPathActive(pathname: string, href: string, mode: "exact" | "prefix"): boolean {
  const p = normalizePathname(pathname);
  const h = normalizePathname(href);
  if (mode === "exact") return p === h;
  if (p === h) return true;
  return p.startsWith(`${h}/`);
}
