import type { APIRoute } from "astro";
import { canonicalFor, getSiteStaticPaths, requireSiteConfig } from "../../lib/site-routing";
import { toCanonical } from "../../lib/site-data";

export const prerender = true;

export function getStaticPaths() {
  return getSiteStaticPaths();
}

export const GET: APIRoute = ({ params }) => {
  const siteSlug = params.site!;
  const siteConfig = requireSiteConfig(siteSlug);
  const rootBaseUrl =
    import.meta.env.PUBLIC_ROOT_BASE_URL?.toString().trim() || "https://wordok.top";

  const sitemapUrl = canonicalFor(siteConfig, `/${siteSlug}/sitemap.xml`);
  const sitemapIndexUrl = toCanonical(rootBaseUrl, "/sitemap_index.xml");
  const fullSiteSitemapUrl = toCanonical(rootBaseUrl, "/sitemap.xml");

  const body =
    `User-agent: *\nAllow: /\n\n` +
    `# Site + full-site discovery for Google/Bing\n` +
    `Sitemap: ${sitemapIndexUrl}\n` +
    `Sitemap: ${fullSiteSitemapUrl}\n` +
    `Sitemap: ${sitemapUrl}\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};


