/**
 * 基于关键词的智能相关文章推荐
 * 通过关键词重叠度和标题语义相似性打分
 */

type PostData = {
  site: string;
  slug: string;
  frontmatter: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
};

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fff-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2),
  );
}

function getPostKeywords(post: PostData): Set<string> {
  const keywords = new Set<string>();

  if (post.frontmatter.keywords) {
    for (const kw of post.frontmatter.keywords) {
      keywords.add(kw.toLowerCase().trim());
    }
  }

  if (post.frontmatter.title) {
    for (const w of tokenize(post.frontmatter.title)) {
      keywords.add(w);
    }
  }

  if (post.frontmatter.description) {
    for (const w of tokenize(post.frontmatter.description)) {
      if (w.length > 3) keywords.add(w); // 忽略过短词
    }
  }

  return keywords;
}

function computeScore(currentKw: Set<string>, candidateKw: Set<string>): number {
  let score = 0;

  for (const kw of currentKw) {
    if (candidateKw.has(kw)) {
      score += 3; // 精确匹配
    } else {
      for (const ckw of candidateKw) {
        if (kw.includes(ckw) || ckw.includes(kw)) {
          score += 1; // 部分匹配
        }
      }
    }
  }

  return score;
}

export function getRelatedPosts(
  currentSlug: string,
  allPosts: PostData[],
  maxResults: number = 3,
): PostData[] {
  const current = allPosts.find((p) => p.slug === currentSlug);
  if (!current) {
    return allPosts.filter((p) => p.slug !== currentSlug).slice(0, maxResults);
  }

  const currentKeywords = getPostKeywords(current);

  const scored = allPosts
    .filter((p) => p.slug !== currentSlug)
    .map((post) => {
      const postKeywords = getPostKeywords(post);
      const score = computeScore(currentKeywords, postKeywords);
      return { post, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);

  return scored.map((s) => s.post);
}
