/**
 * 全站 Google AdSense Publisher ID（wordok.top）。
 * 可通过 PUBLIC_ADSENSE_PUBLISHER_ID 覆盖。
 */
export const WORDOK_ADSENSE_PUBLISHER_ID = "ca-pub-1186063507358775";

export type AdSenseConfig = {
  publisherId?: string;
  adSlot?: string;
};

/**
 * 解析 AdSense 配置：站点 config.adSlot > PUBLIC_ADSENSE_AD_SLOT > 空（不渲染广告位）
 * Publisher：站点 config > PUBLIC_ADSENSE_PUBLISHER_ID > 默认 ID
 */
export function resolveAdsense(config?: AdSenseConfig): AdSenseConfig {
  const envId =
    typeof import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID === "string"
      ? import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID.trim()
      : "";
  const envSlot =
    typeof import.meta.env.PUBLIC_ADSENSE_AD_SLOT === "string"
      ? import.meta.env.PUBLIC_ADSENSE_AD_SLOT.trim()
      : "";
  const publisherId =
    config?.publisherId?.trim() || envId || WORDOK_ADSENSE_PUBLISHER_ID;
  const adSlot = config?.adSlot?.trim() || envSlot || undefined;
  return adSlot ? { publisherId, adSlot } : { publisherId };
}
