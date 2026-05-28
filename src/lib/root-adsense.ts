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
 * 解析 AdSense 配置：站点 config > env > 默认 Publisher ID
 */
export function resolveAdsense(config?: AdSenseConfig): AdSenseConfig {
  const envId =
    typeof import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID === "string"
      ? import.meta.env.PUBLIC_ADSENSE_PUBLISHER_ID.trim()
      : "";
  const publisherId =
    config?.publisherId?.trim() || envId || WORDOK_ADSENSE_PUBLISHER_ID;
  const adSlot = config?.adSlot?.trim();
  return adSlot ? { publisherId, adSlot } : { publisherId };
}
