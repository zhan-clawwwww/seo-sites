/**
 * 全站门户页（/、/sitemap/ 等）使用的 GA4 衡量 ID。
 * 与 GA4 后台数据流「wordok.top」一致；可通过 PUBLIC_GA4_MEASUREMENT_ID 覆盖。
 */
export const WORDOK_GA4_MEASUREMENT_ID = "G-JWYQZWRTBN";

export type RootAnalytics = { ga4Id: string; cfBeacon?: string };

/**
 * 解析门户页 analytics：env > 首个站点 config > 默认衡量 ID
 */
export function resolveRootSiteAnalytics(
  firstSiteAnalytics?: { ga4Id?: string; cfBeacon?: string },
): RootAnalytics {
  const envId =
    typeof import.meta.env.PUBLIC_GA4_MEASUREMENT_ID === "string"
      ? import.meta.env.PUBLIC_GA4_MEASUREMENT_ID.trim()
      : "";
  const ga4Id =
    envId || firstSiteAnalytics?.ga4Id?.trim() || WORDOK_GA4_MEASUREMENT_ID;
  const cf = firstSiteAnalytics?.cfBeacon?.trim();
  return cf ? { ga4Id, cfBeacon: cf } : { ga4Id };
}
