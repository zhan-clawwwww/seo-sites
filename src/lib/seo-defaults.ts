/**
 * 默认 HTML robots：明确允许收录 + Google 富摘要预览指令。
 * 与 Google Search Central 文档一致；勿随意加入 noindex。
 * @see https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
 */
export const DEFAULT_HTML_ROBOTS =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
