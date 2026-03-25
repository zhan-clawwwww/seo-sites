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
