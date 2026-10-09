import { postsNavLabel } from "./channel-nav";

/** 使用 AiNewsLayout（资讯网格 + 顶栏导航）的站点 slug */
export const NEWS_STYLE_SITE_SLUGS = new Set<string>(["ai", "apple", "openclaw"]);

export function isNewsStyleSite(slug: string): boolean {
  return NEWS_STYLE_SITE_SLUGS.has(slug);
}

/** 文章列表页 / 顶栏「资讯」链接文案（与 channel-nav.postsNavLabel 一致） */
export const newsPostsNavLabel = postsNavLabel;

/** 频道首页主列表区块标题 */

export function newsHomeSectionTitle(slug: string): string {
  if (slug === "apple") return "Latest Products";
  if (slug === "openclaw") return "Latest Guides";
  return "Latest News";
}

/** 文章列表页 H1 */
export function newsPostsListHeadline(slug: string): string {
  if (slug === "apple") return "All Products";
  if (slug === "openclaw") return "All Guides";
  return "All News";
}

/** 文章列表页 meta / OG 描述（避免误用 site-a 的通用 SEO 文案） */
export function postsListMetaDescription(
  siteSlug: string,
  siteName: string,
  siteDescription: string,
): string {
  const trimmed = siteDescription.trim();
  switch (siteSlug) {
    case "openclaw":
      return `Browse OpenClaw gateway guides from ${siteName}. Setup, security, and operations.`;
    case "apple":
      return trimmed
        ? `Apple news, products, and guides from ${siteName}. ${trimmed}`
        : `Apple news, products, and guides from ${siteName}.`;
    case "ai":
      return trimmed
        ? `Latest AI news and analysis from ${siteName}. ${trimmed}`
        : `Latest AI news and analysis from ${siteName}.`;
    case "vpn-usa":
      return `USA VPN reviews, privacy guides, and streaming tips from ${siteName}.`;
    case "web3":
      return trimmed
        ? `Web3, crypto, and DeFi coverage from ${siteName}. ${trimmed}`
        : `Web3, crypto, and DeFi coverage from ${siteName}.`;
    case "tesla":
      return trimmed
        ? `Tesla and EV industry news from ${siteName}. ${trimmed}`
        : `Tesla and EV industry news from ${siteName}.`;
    case "streaming":
      return trimmed
        ? `Streaming service guides and reviews from ${siteName}. ${trimmed}`
        : `Streaming service guides and reviews from ${siteName}.`;
    default:
      return trimmed
        ? `Browse articles and guides from ${siteName}. ${trimmed}`
        : `Browse articles and guides from ${siteName}.`;
  }
}
