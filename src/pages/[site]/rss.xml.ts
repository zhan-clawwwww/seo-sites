export const prerender = true;

import { getAllPosts, getSiteConfig } from "../../lib/site-data";
import { getSiteStaticPaths } from "../../lib/site-routing";
import type { APIRoute, GetStaticPaths } from "astro";

export const getStaticPaths: GetStaticPaths = () => getSiteStaticPaths();

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const GET: APIRoute = ({ params }) => {
  const siteSlug = params.site!;
  const siteConfig = getSiteConfig(siteSlug);
  if (!siteConfig) {
    return new Response("Not found", { status: 404 });
  }

  const posts = getAllPosts(siteSlug).slice(0, 30);
  const baseUrl = siteConfig.baseUrl.replace(/\/$/, "");
  const siteUrl = `${baseUrl}/${siteSlug}`;
  const rssUrl = `${siteUrl}/rss.xml`;

  const items = posts
    .map((p) => {
      const title = escapeXml((p.frontmatter.title ?? p.slug).toString());
      const description = escapeXml((p.frontmatter.description ?? "").toString());
      const url = `${siteUrl}/posts/${p.slug}/`;
      const pubDate = p.pubDate
        ? p.pubDate.toUTCString()
        : new Date().toUTCString();
      const image = p.frontmatter.image || siteConfig.defaultImage;
      return `    <item>
      <title>${title}</title>
      <description>${description}</description>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>${image ? `\n      <enclosure url="${escapeXml(image)}" type="image/jpeg" length="0"/>` : ""}
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <description>${escapeXml(siteConfig.description)}</description>
    <link>${siteUrl}/</link>
    <atom:link href="${rssUrl}" rel="self" type="application/rss+xml"/>
    <language>${siteConfig.lang ?? "en"}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Astro</generator>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
