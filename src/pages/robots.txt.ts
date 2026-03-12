import type { APIRoute } from "astro";
import { getAllSites, toCanonical } from "../lib/site-data";

export const prerender = true;

/**
 * 根目录 robots.txt
 * 允许 Googlebot 抓取全站，并列出所有启用站点的 sitemap
 */
export const GET: APIRoute = () => {
  const rootBaseUrl =
    import.meta.env.PUBLIC_ROOT_BASE_URL?.toString().trim() || "https://example.com";
  const sites = getAllSites();

  const lines: string[] = [
    "User-agent: *",
    "Allow: /",
    "",
  ];

  // 每个启用站点的 sitemap
  for (const s of sites) {
    const sitemapUrl = toCanonical(s.config.baseUrl, `/${s.slug}/sitemap.xml`);
    lines.push(`Sitemap: ${sitemapUrl}`);
  }

  const body = lines.join("\n") + "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
