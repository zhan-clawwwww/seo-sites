import type { APIRoute } from "astro";
import { getAllPosts, getAllSites, toCanonical } from "../lib/site-data";
import { asYyyyMmDd, canonicalFor, requireSiteConfig } from "../lib/site-routing";

export const prerender = true;

/**
 * 全站 sitemap.xml - 包含首页、各频道、所有文章
 * 构建时自动生成，新增文章后 push 即会同步更新
 */
export const GET: APIRoute = () => {
  const rootBaseUrl =
    import.meta.env.PUBLIC_ROOT_BASE_URL?.toString().trim() || "https://wordok.top";
  const sites = getAllSites();

  type UrlEntry = { loc: string; lastmod?: string; priority?: number; changefreq?: string };

  const urls: UrlEntry[] = [
    { loc: toCanonical(rootBaseUrl, "/"), lastmod: new Date().toISOString().slice(0, 10), priority: 1.0, changefreq: "daily" },
    { loc: toCanonical(rootBaseUrl, "/sitemap/"), lastmod: new Date().toISOString().slice(0, 10), priority: 0.9, changefreq: "daily" },
  ];

  for (const s of sites) {
    const siteConfig = requireSiteConfig(s.slug);
    const posts = getAllPosts(s.slug);

    urls.push({ loc: canonicalFor(siteConfig, `/${s.slug}/`), priority: 0.95, changefreq: "daily" });
    urls.push({ loc: canonicalFor(siteConfig, `/${s.slug}/posts/`), priority: 0.9, changefreq: "daily" });
    urls.push({ loc: canonicalFor(siteConfig, `/${s.slug}/ai-frontiers/`), priority: 0.85, changefreq: "weekly" });
    urls.push({ loc: canonicalFor(siteConfig, `/${s.slug}/privacy-security/`), priority: 0.85, changefreq: "weekly" });
    urls.push({ loc: canonicalFor(siteConfig, `/${s.slug}/about/`), priority: 0.6, changefreq: "monthly" });
    urls.push({ loc: canonicalFor(siteConfig, `/${s.slug}/contact/`), priority: 0.6, changefreq: "monthly" });
    urls.push({ loc: canonicalFor(siteConfig, `/${s.slug}/privacy/`), priority: 0.4, changefreq: "yearly" });
    urls.push({ loc: canonicalFor(siteConfig, `/${s.slug}/terms/`), priority: 0.4, changefreq: "yearly" });
    urls.push({ loc: canonicalFor(siteConfig, `/${s.slug}/disclosure/`), priority: 0.4, changefreq: "yearly" });

    for (const p of posts) {
      const lastmod = asYyyyMmDd(p.frontmatter.updatedDate ?? p.frontmatter.pubDate);
      urls.push({
        loc: canonicalFor(siteConfig, `/${s.slug}/posts/${p.slug}/`),
        lastmod,
        priority: 0.8,
        changefreq: "weekly",
      });
    }
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => {
        const lastmod = u.lastmod ? `    <lastmod>${escapeXml(u.lastmod)}</lastmod>\n` : "";
        const priority = u.priority != null ? `    <priority>${u.priority.toFixed(1)}</priority>\n` : "";
        const changefreq = u.changefreq ? `    <changefreq>${escapeXml(u.changefreq)}</changefreq>\n` : "";
        return `  <url>\n    <loc>${escapeXml(u.loc)}</loc>\n${lastmod}${priority}${changefreq}  </url>\n`;
      })
      .join("") +
    `</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};

function escapeXml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
