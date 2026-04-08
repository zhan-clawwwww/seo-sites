/** Cloudflare Worker 环境绑定类型 */
export interface Env {
  RELAY_KV: KVNamespace;
  OPENAI_BASE: string;
  ANTHROPIC_BASE: string;
  GEMINI_BASE: string;
  RATE_LIMIT_PER_MIN: string;
  ENVIRONMENT: string;
  // Secrets（通过 wrangler secret put 设置，不写入 wrangler.toml）
  ADMIN_TOKEN?: string;
  JWT_SECRET?: string;
  DEFAULT_OPENAI_KEY?: string;
}

/** KV 中存储的用户记录 */
export interface UserRecord {
  /** 用户的真实 API Key（provider 对应的那个） */
  apiKey: string;
  /** Key 归属的 AI 服务商 */
  provider: "openai" | "anthropic" | "gemini";
  /** 总配额（token 数，-1 表示无限）*/
  quota: number;
  /** 已使用配额 */
  usedQuota: number;
  /** 推广码（注册时携带的） */
  refCode?: string;
  /** 用户邮箱（可选，未来账户系统使用） */
  email?: string;
  /** 创建时间戳 */
  createdAt: number;
}

/** KV 中存储的推广记录 */
export interface ReferralRecord {
  /** 推广者的 relay token（或 userId） */
  ownerId: string;
  /** 总点击次数 */
  clicks: number;
  /** 已转化（注册）次数 */
  conversions: number;
  /** 创建时间 */
  createdAt: number;
}

/** 公开统计数据 */
export interface PublicStats {
  totalRequests: number;
  totalUsers: number;
  uptime: string;
}
