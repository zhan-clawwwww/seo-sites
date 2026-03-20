/**
 * 作者数据管理
 * 用于E-E-A-T信号：Experience, Expertise, Authoritativeness, Trustworthiness
 */

export type Author = {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  email?: string;
  website?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  expertise: string[]; // 专业领域
};

// 作者数据库
export const authors: Record<string, Author> = {
  "tech-team": {
    id: "tech-team",
    name: "TechReview Pro Editorial Team",
    bio: "Our editorial team consists of experienced technical writers, SEO specialists, and industry analysts with years of expertise in web technologies, SEO optimization, and technical analysis. We bring real-world testing and data-driven insights to every review and guide we publish.",
    expertise: [
      "Technical SEO",
      "Web Development",
      "Performance Optimization",
      "Content Strategy",
    ],
    email: "iwangzhanpeng94@gmail.com",
    website: "https://techreviewpro.com",
    social: {
      twitter: "https://twitter.com/techreviewpro",
      linkedin: "https://linkedin.com/company/techreviewpro",
    },
  },
  "seo-expert": {
    id: "seo-expert",
    name: "Sarah Chen",
    bio: "SEO strategist with 8+ years of experience in technical SEO, content optimization, and search engine algorithms. Specialized in on-page optimization, structured data implementation, and Core Web Vitals optimization.",
    expertise: [
      "Technical SEO",
      "On-Page Optimization",
      "Structured Data",
      "Core Web Vitals",
    ],
    email: "iwangzhanpeng94@gmail.com",
    social: {
      twitter: "https://twitter.com/sarahchen_seo",
      linkedin: "https://linkedin.com/in/sarahchen-seo",
    },
  },
  "web-dev-expert": {
    id: "web-dev-expert",
    name: "Alex Martinez",
    bio: "Full-stack developer and technical writer with expertise in modern web frameworks, static site generators, and performance optimization. Passionate about building fast, SEO-friendly web applications.",
    expertise: [
      "Web Development",
      "Static Site Generators",
      "Performance Optimization",
      "JavaScript Frameworks",
    ],
    email: "iwangzhanpeng94@gmail.com",
    social: {
      github: "https://github.com/alexmartinez",
      linkedin: "https://linkedin.com/in/alexmartinez-dev",
    },
  },
  "vpn-expert": {
    id: "vpn-expert",
    name: "VPN Expert Team",
    bio: "Our team has tested 30+ VPN services over 6+ months, running 200+ speed tests, analyzing privacy policies, and verifying security claims. We focus on hands-on testing, protocol analysis, and practical security guidance for users in the USA market. All recommendations are based on real-world testing — no paid rankings.",
    expertise: [
      "VPN Reviews",
      "Online Privacy",
      "Network Security",
      "Speed Testing",
    ],
    email: "iwangzhanpeng94@gmail.com",
    website: "https://wordok.top",
  },
  "ai-editor": {
    id: "ai-editor",
    name: "AI News Editorial",
    bio: "AI and machine learning coverage team. We track breakthroughs, industry trends, and practical guides for developers and enthusiasts.",
    expertise: [
      "Artificial Intelligence",
      "LLMs",
      "Machine Learning",
    ],
    email: "iwangzhanpeng94@gmail.com",
    website: "https://wordok.top",
  },
  "matrix-agent": {
    id: "matrix-agent",
    name: "Matrix Agent",
    bio: "AI-powered content curation and analysis. We aggregate and summarize the latest news and insights from trusted sources.",
    expertise: ["AI News", "Tech News", "Content Curation"],
    email: "iwangzhanpeng94@gmail.com",
    website: "https://wordok.top",
  },
  "apple-editor": {
    id: "apple-editor",
    name: "Apple Devices Editorial",
    bio: "Apple product specialists covering iPhone, MacBook, and the full Apple ecosystem. We provide detailed specs, reviews, and buying guides for every Apple device.",
    expertise: [
      "iPhone",
      "MacBook",
      "Apple Hardware",
    ],
    email: "iwangzhanpeng94@gmail.com",
    website: "https://wordok.top",
  },
};

/**
 * 根据作者ID获取作者信息
 * 兼容带空格的 id（如 "Matrix Agent"）映射到 matrix-agent
 */
export function getAuthor(authorId: string): Author | null {
  const normalized = authorId?.trim();
  if (!normalized) return null;
  if (authors[normalized]) return authors[normalized];
  // 兼容 "Matrix Agent" -> matrix-agent
  const alias = normalized.replace(/\s+/g, "-").toLowerCase();
  return authors[alias] || null;
}

/**
 * 获取所有作者
 */
export function getAllAuthors(): Author[] {
  return Object.values(authors);
}

/**
 * 根据站点获取默认作者
 */
export function getDefaultAuthorForSite(siteSlug: string): Author {
  // 根据站点返回对应的默认作者
  if (siteSlug === "site-a") {
    return authors["tech-team"];
  }
  if (siteSlug === "vpn-usa") {
    return authors["vpn-expert"];
  }
  if (siteSlug === "ai") {
    return authors["ai-editor"];
  }
  if (siteSlug === "apple") {
    return authors["apple-editor"];
  }
  // 默认返回tech-team
  return authors["tech-team"];
}

