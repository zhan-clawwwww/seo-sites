import { shouldBuildPost } from "./index-schedule";
import { estimateReadingTime } from "./reading-time";

export type AffiliateProduct = {
  name: string;
  url: string;
  badge?: string;
  price?: string;
  discount?: string;
  features?: string[];
  rating?: number;
  logoText?: string;
};

export type SiteConfig = {
  name: string;
  description: string;
  keywords?: string[];
  baseUrl: string;
  lang?: string;
  defaultImage?: string;
  contact?: {
    email?: string;
    privacyEmail?: string;
    businessEmail?: string;
  };
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  analytics?: {
    ga4Id?: string;
    cfBeacon?: string;
  };
  giscus?: {
    repo?: string;
    repoId?: string;
    category?: string;
    categoryId?: string;
  };
  affiliates?: AffiliateProduct[];
  adsense?: {
    publisherId?: string;
    adSlot?: string;
  };
};

export type PostFrontmatter = {
  title: string;
  description?: string;
  pubDate?: string;
  updatedDate?: string;
  keywords?: string[];
  author?: string;
  image?: string;
  faq?: Array<{ question: string; answer: string }>;
};

type MarkdownModule = {
  frontmatter: PostFrontmatter;
  Content: unknown;
  rawContent?: () => string;
};

type RawSiteConfig = {
  name?: unknown;
  siteName?: unknown;
  description?: unknown;
  keywords?: unknown;
  baseUrl?: unknown;
  lang?: unknown;
  defaultImage?: unknown;
  contact?: {
    email?: unknown;
    privacyEmail?: unknown;
    businessEmail?: unknown;
  };
  social?: {
    twitter?: unknown;
    linkedin?: unknown;
    github?: unknown;
  };
  analytics?: {
    ga4Id?: unknown;
    cfBeacon?: unknown;
  };
  giscus?: {
    repo?: unknown;
    repoId?: unknown;
    category?: unknown;
    categoryId?: unknown;
  };
  affiliates?: unknown[];
  adsense?: {
    publisherId?: unknown;
    adSlot?: unknown;
  };
};

function normalizeKeywords(k: unknown): string[] | undefined {
  if (!k) return undefined;
  if (Array.isArray(k)) return k.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof k === "string")
    return k
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  return undefined;
}

function str(v: unknown): string | undefined {
  if (!v) return undefined;
  const s = v.toString().trim();
  return s || undefined;
}

function normalizeSiteConfig(raw: RawSiteConfig): SiteConfig {
  const name = (raw.siteName ?? raw.name ?? "").toString().trim();
  const description = (raw.description ?? "").toString().trim();
  const baseUrl = (raw.baseUrl ?? "").toString().trim();
  const keywords = normalizeKeywords(raw.keywords);
  const lang = str(raw.lang);
  const defaultImage = str(raw.defaultImage);

  if (!name) throw new Error(`Invalid site config: missing "siteName" (or "name")`);
  if (!description) throw new Error(`Invalid site config: missing "description"`);
  if (!baseUrl) throw new Error(`Invalid site config: missing "baseUrl"`);

  const contact = raw.contact
    ? {
        email: str(raw.contact.email),
        privacyEmail: str(raw.contact.privacyEmail),
        businessEmail: str(raw.contact.businessEmail),
      }
    : undefined;

  const social = raw.social
    ? {
        twitter: str(raw.social.twitter),
        linkedin: str(raw.social.linkedin),
        github: str(raw.social.github),
      }
    : undefined;

  const analytics = raw.analytics
    ? {
        ga4Id: str(raw.analytics.ga4Id),
        cfBeacon: str(raw.analytics.cfBeacon),
      }
    : undefined;

  const giscus = raw.giscus
    ? {
        repo: str(raw.giscus.repo),
        repoId: str(raw.giscus.repoId),
        category: str(raw.giscus.category),
        categoryId: str(raw.giscus.categoryId),
      }
    : undefined;

  const affiliates = Array.isArray(raw.affiliates)
    ? raw.affiliates
        .filter((a): a is Record<string, unknown> => typeof a === "object" && a !== null)
        .map((a) => ({
          name: String(a.name ?? "").trim(),
          url: String(a.url ?? "").trim(),
          badge: a.badge ? String(a.badge).trim() : undefined,
          price: a.price ? String(a.price).trim() : undefined,
          discount: a.discount ? String(a.discount).trim() : undefined,
          features: Array.isArray(a.features)
            ? a.features.map(String).filter(Boolean)
            : undefined,
          rating: typeof a.rating === "number" ? a.rating : undefined,
          logoText: a.logoText ? String(a.logoText).trim() : undefined,
        }))
        .filter((a) => a.name && a.url)
    : undefined;

  const adsense = raw.adsense
    ? {
        publisherId: str(raw.adsense.publisherId),
        adSlot: str(raw.adsense.adSlot),
      }
    : undefined;

  return { name, description, baseUrl, keywords, lang, defaultImage, contact, social, analytics, giscus, affiliates, adsense };
}

const configModules = import.meta.glob<RawSiteConfig>("../../sites/*/config.json", {
  eager: true,
  import: "default",
});

const postModules = import.meta.glob<MarkdownModule>("../../sites/*/posts/*.md", {
  eager: true,
});

function siteSlugFromConfigPath(path: string) {
  const m = path.match(/\/sites\/([^/]+)\/config\.json$/);
  if (!m) return null;
  return m[1];
}

function postInfoFromPath(path: string) {
  const m = path.match(/\/sites\/([^/]+)\/posts\/([^/]+)\.md$/);
  if (!m) return null;
  return { site: m[1], slug: m[2] };
}

/**
 * 多站点启用控制
 * 通过环境变量 ENABLED_SITES 控制（逗号分隔），默认启用 site-a
 * 例：ENABLED_SITES=site-a,site-b
 */
const ENABLED_SITES = (
  (typeof import.meta.env !== "undefined" && import.meta.env.ENABLED_SITES) || "site-a"
)
  .toString()
  .split(",")
  .map((s: string) => s.trim())
  .filter(Boolean);

export function getAllSites() {
  return Object.entries(configModules)
    .map(([path, raw]) => {
      const slug = siteSlugFromConfigPath(path);
      if (!slug) return null;
      if (!ENABLED_SITES.includes(slug)) return null;
      const config = normalizeSiteConfig(raw ?? {});
      return { slug, config };
    })
    .filter((x): x is { slug: string; config: SiteConfig } => Boolean(x))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

export function getSiteConfig(siteSlug: string) {
  const found = getAllSites().find((s) => s.slug === siteSlug);
  return found?.config ?? null;
}

export function getAllPosts(siteSlug?: string) {
  // 获取所有启用站点的 slug 列表
  const enabledSlugs = siteSlug ? [siteSlug] : getAllSites().map((s) => s.slug);

  const posts = Object.entries(postModules)
    .map(([path, mod]) => {
      const info = postInfoFromPath(path);
      if (!info) return null;
      // 只返回启用站点的文章
      if (!enabledSlugs.includes(info.site)) return null;
      if (siteSlug && info.site !== siteSlug) return null;
      return { ...info, mod };
    })
    .filter(
      (x): x is { site: string; slug: string; mod: MarkdownModule } => Boolean(x),
    )
    .map((p) => {
      const frontmatter = p.mod.frontmatter ?? {};
      const normalizedFrontmatter = {
        ...frontmatter,
        keywords: normalizeKeywords(frontmatter.keywords),
      };
      const rawContent =
        typeof (p.mod as any).rawContent === "function" ? (p.mod as any).rawContent() : "";
      const fallbackText = `${normalizedFrontmatter.title || ""} ${normalizedFrontmatter.description || ""}`;
      const readingTime = estimateReadingTime(rawContent || fallbackText);
      return {
        ...p,
        frontmatter: normalizedFrontmatter,
        pubDate: normalizedFrontmatter.pubDate ? new Date(normalizedFrontmatter.pubDate) : null,
        readingTime,
      };
    })
    .sort((a, b) => {
      const at = a.pubDate?.getTime() ?? 0;
      const bt = b.pubDate?.getTime() ?? 0;
      return bt - at;
    });

  if (siteSlug) {
    const allPostSlugs = posts.map((p) => p.slug);
    return posts.filter((p) => shouldBuildPost(siteSlug, p.slug, allPostSlugs));
  }

  return posts;
}

export function getPostModule(siteSlug: string, slug: string) {
  for (const [path, mod] of Object.entries(postModules)) {
    const info = postInfoFromPath(path);
    if (!info) continue;
    if (info.site === siteSlug && info.slug === slug) return mod;
  }
  return null;
}

/**
 * 获取文章的原始 Markdown 内容（用于阅读时间计算、TOC 提取等）
 */
export function getPostRawContent(siteSlug: string, slug: string): string {
  const mod = getPostModule(siteSlug, slug);
  if (!mod) return "";
  if (typeof (mod as any).rawContent === "function") {
    return (mod as any).rawContent();
  }
  return "";
}

export function toCanonical(baseUrl: string, pathname: string) {
  return new URL(pathname, baseUrl).toString();
}

/**
 * 从 Twitter URL 提取 handle（如 @techreviewpro）
 */
export function getTwitterHandleFromUrl(url: string | undefined): string | undefined {
  if (!url || typeof url !== "string") return undefined;
  const m = url.match(/twitter\.com\/([a-zA-Z0-9_]+)/);
  return m ? `@${m[1]}` : undefined;
}
