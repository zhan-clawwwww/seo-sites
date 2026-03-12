/**
 * 计算文章阅读时间
 * 中文 ~400字/分钟，英文 ~200词/分钟
 */

export function estimateReadingTime(content: string): number {
  // 移除 HTML 标签和 frontmatter
  const cleaned = content
    .replace(/^---[\s\S]*?---/, "")
    .replace(/<[^>]+>/g, "")
    .replace(/```[\s\S]*?```/g, "")
    .trim();

  const chineseChars = (cleaned.match(/[\u4e00-\u9fff]/g) || []).length;
  const englishWords = cleaned
    .replace(/[\u4e00-\u9fff]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  const chineseMinutes = chineseChars / 400;
  const englishMinutes = englishWords / 200;

  return Math.max(1, Math.ceil(chineseMinutes + englishMinutes));
}

export function formatReadingTime(minutes: number): string {
  if (minutes <= 1) return "1 min read";
  return `${minutes} min read`;
}
