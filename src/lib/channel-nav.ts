/**
 * 全站专栏短标签与文案（与首页 columnMeta.label 对齐）
 */
export const CHANNEL_LABELS: Record<string, string> = {
  "vpn-usa": "VPN",
  ai: "AI News",
  apple: "Apple",
  streaming: "Streaming",
  web3: "Web3",
  "site-a": "Tech Guides",
  tesla: "Tesla",
  openclaw: "OpenClaw",
};

/** 顶栏 / 面包屑：当前站文章列表链接文字 */
export function postsNavLabel(slug: string): string {
  if (slug === "apple") return "Products";
  if (slug === "openclaw") return "Guides";
  return "News";
}

/** 页脚 Explore / HTML 站点地图：posts 入口展示名 */
export function postsHubLabel(slug: string): string {
  if (slug === "apple") return "Products";
  if (slug === "openclaw") return "Guides";
  return "Articles";
}
