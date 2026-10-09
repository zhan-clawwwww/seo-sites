/**
 * 低质量模板文 / 占位内容：noindex 且不进 sitemap
 */
const TEMPLATE_SLUG_PATTERNS: RegExp[] = [
  /-high-quality-\d+$/i,
  /-analysis-\d+$/i,
  /-comprehensive-analysis$/i,
];

const PLACEHOLDER_CONTENT_MARKERS = [
  "[technology 1]",
  "[technology 2]",
  "[technology 3]",
];

export const TEMPLATE_SPAM_ROBOTS = "noindex, follow";

export function isTemplateSpamSlug(postSlug: string): boolean {
  return TEMPLATE_SLUG_PATTERNS.some((re) => re.test(postSlug));
}

export function hasTemplatePlaceholderContent(rawContent: string): boolean {
  if (!rawContent) return false;
  const lower = rawContent.toLowerCase();
  return PLACEHOLDER_CONTENT_MARKERS.every((m) => lower.includes(m.toLowerCase()));
}

export function isTemplateSpamPost(postSlug: string, rawContent?: string): boolean {
  if (isTemplateSpamSlug(postSlug)) return true;
  if (rawContent && hasTemplatePlaceholderContent(rawContent)) return true;
  return false;
}

export function shouldIncludePostInSitemap(postSlug: string, rawContent?: string): boolean {
  return !isTemplateSpamPost(postSlug, rawContent);
}
