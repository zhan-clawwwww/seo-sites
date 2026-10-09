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

/** Programmatic iPhone / MacBook spec pages under sites/apple/posts/ */
const APPLE_DEVICE_SPEC_SLUG = /^(iphone|macbook)(-|$)/;

const APPLE_DEVICE_TEMPLATE_MARKER = "## Key Specifications";

export const THIN_CONTENT_MAX_WORDS = 600;

export function isAppleDeviceSpecSlug(postSlug: string): boolean {
  return APPLE_DEVICE_SPEC_SLUG.test(postSlug);
}

export function markdownBodyWordCount(rawContent: string): number {
  const body = rawContent.replace(/^---[\s\S]*?---\s*/, "");
  return body.split(/\s+/).filter(Boolean).length;
}

/**
 * Thin Apple device/spec templates: short body or obvious spec scaffold.
 * ~80+ pages; keep noindex,follow and out of sitemaps until expanded.
 */
export function isAppleThinDeviceSpecPage(
  siteSlug: string,
  postSlug: string,
  rawContent?: string,
): boolean {
  if (siteSlug !== "apple" || !isAppleDeviceSpecSlug(postSlug)) return false;
  if (!rawContent?.trim()) return true;
  const words = markdownBodyWordCount(rawContent);
  if (words < THIN_CONTENT_MAX_WORDS) return true;
  if (rawContent.includes(APPLE_DEVICE_TEMPLATE_MARKER) && words < THIN_CONTENT_MAX_WORDS + 150) {
    return true;
  }
  return false;
}

export function shouldNoindexPost(
  siteSlug: string,
  postSlug: string,
  rawContent?: string,
  hasUnreplacedPlaceholders?: boolean,
): boolean {
  if (hasUnreplacedPlaceholders) return true;
  if (isTemplateSpamPost(postSlug, rawContent)) return true;
  if (isAppleThinDeviceSpecPage(siteSlug, postSlug, rawContent)) return true;
  return false;
}

export function shouldIncludePostInSitemap(
  siteSlug: string,
  postSlug: string,
  rawContent?: string,
  hasUnreplacedPlaceholders?: boolean,
): boolean {
  return !shouldNoindexPost(siteSlug, postSlug, rawContent, hasUnreplacedPlaceholders);
}
