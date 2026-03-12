import type { APIRoute } from "astro";
import { canonicalFor, getSiteStaticPaths, requireSiteConfig } from "../../lib/site-routing";

export const prerender = true;

export function getStaticPaths() {
  return getSiteStaticPaths();
}

export const GET: APIRoute = ({ params }) => {
  const siteSlug = params.site!;
  const siteConfig = requireSiteConfig(siteSlug);

  const sitemapUrl = canonicalFor(siteConfig, `/${siteSlug}/sitemap.xml`);
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};


