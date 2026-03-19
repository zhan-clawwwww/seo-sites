import type { APIRoute } from "astro";
import { toCanonical } from "../lib/site-data";

export const prerender = true;

/**
 * Root sitemap - homepage for SEO discovery
 */
export const GET: APIRoute = () => {
  const rootBaseUrl =
    import.meta.env.PUBLIC_ROOT_BASE_URL?.toString().trim() || "https://wordok.top";

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <url>\n` +
    `    <loc>${escapeXml(toCanonical(rootBaseUrl, "/"))}</loc>\n` +
    `    <priority>1.0</priority>\n` +
    `    <changefreq>daily</changefreq>\n` +
    `  </url>\n` +
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
