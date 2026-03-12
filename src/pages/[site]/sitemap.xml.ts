import type { APIRoute } from "astro";
import { getAllPosts } from "../../lib/site-data";
import { asYyyyMmDd, canonicalFor, getSiteStaticPaths, requireSiteConfig } from "../../lib/site-routing";

export const prerender = true;

export function getStaticPaths() {
  return getSiteStaticPaths();
}

function xmlEscape(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export const GET: APIRoute = ({ params }) => {
  const siteSlug = params.site!;
  const siteConfig = requireSiteConfig(siteSlug);

  const posts = getAllPosts(siteSlug);

  type UrlEntry = { loc: string; lastmod?: string; priority?: number; changefreq?: string };

  const urls: UrlEntry[] = [
    { loc: canonicalFor(siteConfig, `/${siteSlug}/`), priority: 1.0, changefreq: "daily" },
    { loc: canonicalFor(siteConfig, `/${siteSlug}/posts/`), priority: 0.9, changefreq: "daily" },
    { loc: canonicalFor(siteConfig, `/${siteSlug}/about/`), priority: 0.6, changefreq: "monthly" },
    { loc: canonicalFor(siteConfig, `/${siteSlug}/contact/`), priority: 0.6, changefreq: "monthly" },
    { loc: canonicalFor(siteConfig, `/${siteSlug}/privacy/`), priority: 0.4, changefreq: "yearly" },
    { loc: canonicalFor(siteConfig, `/${siteSlug}/terms/`), priority: 0.4, changefreq: "yearly" },
    { loc: canonicalFor(siteConfig, `/${siteSlug}/disclosure/`), priority: 0.4, changefreq: "yearly" },
  ];

  for (const p of posts) {
    const lastmod = asYyyyMmDd(p.frontmatter.updatedDate ?? p.frontmatter.pubDate);
    urls.push({
      loc: canonicalFor(siteConfig, `/${siteSlug}/posts/${p.slug}/`),
      lastmod,
      priority: 0.8,
      changefreq: "weekly",
    });
  }

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map((u) => {
        const lastmod = u.lastmod ? `    <lastmod>${xmlEscape(u.lastmod)}</lastmod>\n` : "";
        const priority = u.priority != null ? `    <priority>${u.priority.toFixed(1)}</priority>\n` : "";
        const changefreq = u.changefreq ? `    <changefreq>${xmlEscape(u.changefreq)}</changefreq>\n` : "";
        return `  <url>\n    <loc>${xmlEscape(u.loc)}</loc>\n${lastmod}${priority}${changefreq}  </url>\n`;
      })
      .join("") +
    `</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};


