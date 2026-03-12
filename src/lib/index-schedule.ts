/**
 * Google 索引节奏策略管理
 * 
 * 功能：
 * 1. 根据配置控制哪些文章应该被构建和索引
 * 2. 基于时间自动计算应该放出的文章
 * 3. 支持手动配置和自动计算两种模式
 */

export type IndexSchedule = {
  strategy: "gradual" | "all" | "manual";
  launchDate: string; // ISO 8601 格式
  releaseIntervalHours: number;
  postsPerRelease: {
    min: number;
    max: number;
  };
  initialPosts: string[]; // 首次上线时放出的文章 slug 列表
  releaseSchedule: Array<{
    releaseDate: string; // ISO 8601 格式
    posts: string[]; // 该批次放出的文章 slug 列表
  }>;
  notes?: string;
};

const scheduleModules = import.meta.glob<IndexSchedule>("../../sites/*/index-schedule.json", {
  eager: true,
  import: "default",
});

function schedulePathFromSite(siteSlug: string): string {
  return `../../sites/${siteSlug}/index-schedule.json`;
}

/**
 * 获取站点的索引节奏配置
 */
export function getIndexSchedule(siteSlug: string): IndexSchedule | null {
  const path = schedulePathFromSite(siteSlug);
  const schedule = scheduleModules[path];
  if (!schedule) return null;
  return schedule as IndexSchedule;
}

/**
 * 根据索引节奏配置，计算当前应该放出的文章列表
 */
export function getReleasedPosts(siteSlug: string, allPostSlugs: string[]): string[] {
  const schedule = getIndexSchedule(siteSlug);
  if (!schedule) {
    // 如果没有配置，默认全部放出
    return allPostSlugs;
  }

  if (schedule.strategy === "all") {
    return allPostSlugs;
  }

  if (schedule.strategy === "manual") {
    // 手动模式：只返回 releaseSchedule 中所有已到期的批次
    const now = new Date();
    const released: string[] = [];
    
    for (const release of schedule.releaseSchedule) {
      const releaseDate = new Date(release.releaseDate);
      if (releaseDate <= now) {
        released.push(...release.posts);
      }
    }
    
    return [...new Set(released)]; // 去重
  }

  // gradual 模式：基于时间的自动计算
  const now = new Date();
  const launchDate = new Date(schedule.launchDate);
  
  if (now < launchDate) {
    // 还未到上线时间，返回空数组
    return [];
  }

  // 计算已经过了多少个释放周期
  const hoursSinceLaunch = (now.getTime() - launchDate.getTime()) / (1000 * 60 * 60);
  const cyclesPassed = Math.floor(hoursSinceLaunch / schedule.releaseIntervalHours);
  
  // 初始文章
  const released: string[] = [...schedule.initialPosts];
  
  // 计算每个周期应该放出的文章数量
  const postsPerCycle = schedule.postsPerRelease.min;
  const totalPostsToRelease = Math.min(
    cyclesPassed * postsPerCycle,
    allPostSlugs.length - schedule.initialPosts.length
  );
  
  // 获取还未放出的文章（按 pubDate 排序，优先放出较早的文章）
  const remainingPosts = allPostSlugs.filter(
    (slug) => !schedule.initialPosts.includes(slug)
  );
  
  // 放出前 N 篇
  released.push(...remainingPosts.slice(0, totalPostsToRelease));
  
  return [...new Set(released)]; // 去重
}

/**
 * 检查文章是否应该被构建（根据索引节奏）
 */
export function shouldBuildPost(siteSlug: string, postSlug: string, allPostSlugs: string[]): boolean {
  const releasedPosts = getReleasedPosts(siteSlug, allPostSlugs);
  return releasedPosts.includes(postSlug);
}

