import type { SiteConfig } from "./site-data";
import { getAllPosts, getAllSites, getPostModule, getSiteConfig, toCanonical } from "./site-data";

export type SiteParams = { site: string };
export type PostParams = { site: string; slug: string };

export function getSiteStaticPaths(): Array<{ params: SiteParams }> {
  return getAllSites().map((s) => ({ params: { site: s.slug } }));
}

export function getPostStaticPaths(): Array<{ params: PostParams }> {
  return getAllPosts().map((p) => ({ params: { site: p.site, slug: p.slug } }));
}

export function requireSiteConfig(siteSlug: string): SiteConfig {
  const siteConfig = getSiteConfig(siteSlug);
  if (!siteConfig) throw new Error(`Unknown site: ${siteSlug}`);
  return siteConfig;
}

export function requirePostModule(siteSlug: string, slug: string) {
  const mod = getPostModule(siteSlug, slug);
  if (!mod) throw new Error(`Unknown post: ${siteSlug}/${slug}`);
  return mod;
}

export function asYyyyMmDd(dateLike: unknown): string | undefined {
  if (!dateLike) return undefined;
  const s = String(dateLike).trim();
  if (!s) return undefined;
  // 支持 "YYYY-MM-DD" 或 ISO 日期字符串
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toISOString().slice(0, 10);
}

/** 构建日（静态站点每次部署刷新 sitemap 用） */
export function buildStampYyyyMmDd(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * 从文章列表取最新内容日期 YYYY-MM-DD（优先 updatedDate，其次 pubDate）
 * 用于频道首页、列表等 URL 的 lastmod，便于 GSC 发现更新
 */
export function latestPostLastmodYyyyMmDd(
  posts: Array<{ frontmatter: { pubDate?: string; updatedDate?: string } }>,
): string | undefined {
  let max = 0;
  for (const p of posts) {
    const raw = p.frontmatter.updatedDate ?? p.frontmatter.pubDate;
    if (!raw) continue;
    const t = new Date(String(raw).trim()).getTime();
    if (!Number.isNaN(t) && t > max) max = t;
  }
  if (max === 0) return undefined;
  return new Date(max).toISOString().slice(0, 10);
}

export function canonicalFor(siteConfig: SiteConfig, pathname: string) {
  return toCanonical(siteConfig.baseUrl, pathname);
}


