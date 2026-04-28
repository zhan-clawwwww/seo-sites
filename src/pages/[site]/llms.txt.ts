import type { APIRoute, GetStaticPaths } from "astro";
import { canonicalFor, getSiteStaticPaths } from "../../lib/site-routing";
import { getAllPosts, getSiteConfig } from "../../lib/site-data";

export const prerender = true;

export const getStaticPaths: GetStaticPaths = () => getSiteStaticPaths();

export const GET: APIRoute = ({ params }) => {
  const siteSlug = params.site!;
  const cfg = getSiteConfig(siteSlug);
  if (!cfg) {
    return new Response("Not found", { status: 404 });
  }

  const posts = getAllPosts(siteSlug).slice(0, 20);
  const lines: string[] = [
    `# llms.txt — ${cfg.name}`,
    `site: ${siteSlug}`,
    "",
    cfg.description,
    "",
    "## Index",
    `- Posts: ${canonicalFor(cfg, `/${siteSlug}/posts/`)}`,
    `- RSS: ${canonicalFor(cfg, `/${siteSlug}/rss.xml`)}`,
    `- XML sitemap: ${canonicalFor(cfg, `/${siteSlug}/sitemap.xml`)}`,
    "",
    "## Recent URLs",
  ];

  for (const p of posts) {
    const title = (p.frontmatter.title ?? p.slug).toString().replace(/\s+/g, " ").trim();
    lines.push(`- ${title}: ${canonicalFor(cfg, `/${siteSlug}/posts/${p.slug}/`)}`);
  }

  if (siteSlug === "ai-corpus") {
    lines.push("", "## Plain-text mirrors", "Each article: `/{site}/posts/{slug}/plain.txt`", "");
  }

  lines.push("");
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
