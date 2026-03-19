import type { APIRoute } from "astro";
import { getAllSites, toCanonical } from "../lib/site-data";

export const prerender = true;

/**
 * Sitemap Index - 供 Google 等搜索引擎发现所有子 sitemap
 * 提交此 URL 到 Google Search Console 即可收录全站
 */
export const GET: APIRoute = () => {
  const rootBaseUrl =
    import.meta.env.PUBLIC_ROOT_BASE_URL?.toString().trim() || "https://wordok.top";
  const sites = getAllSites();

  const sitemaps = [
    { loc: toCanonical(rootBaseUrl, "/sitemap.xml") },
    ...sites.map((s) => ({
      loc: toCanonical(s.config.baseUrl, `/${s.slug}/sitemap.xml`),
    })),
  ];

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    sitemaps
      .map(
        (s) =>
          `  <sitemap>\n` +
          `    <loc>${escapeXml(s.loc)}</loc>\n` +
          `  </sitemap>\n`
      )
      .join("") +
    `</sitemapindex>\n`;

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
