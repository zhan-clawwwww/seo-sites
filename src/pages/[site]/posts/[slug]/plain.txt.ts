import type { APIRoute, GetStaticPaths } from "astro";
import { getPostStaticPaths } from "../../../../lib/site-routing";
import { getPostRawContent } from "../../../../lib/site-data";

export const prerender = true;

export const getStaticPaths: GetStaticPaths = () => getPostStaticPaths();

function stripFrontmatter(md: string): string {
  return md.replace(/^---[\s\S]*?---\s*/u, "").trim();
}

export const GET: APIRoute = ({ params }) => {
  const site = params.site!;
  const slug = params.slug!;
  const raw = getPostRawContent(site, slug);
  if (!raw) {
    return new Response("Not found", { status: 404 });
  }
  const body = stripFrontmatter(raw);
  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
