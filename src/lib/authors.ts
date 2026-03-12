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
    bio: "VPN and privacy specialists focused on hands-on testing, protocol analysis, and practical security guidance for users in the USA market.",
    expertise: [
      "VPN Reviews",
      "Online Privacy",
      "Network Security",
    ],
    email: "iwangzhanpeng94@gmail.com",
    website: "https://wordok.top",
  },
};

/**
 * 根据作者ID获取作者信息
 */
export function getAuthor(authorId: string): Author | null {
  return authors[authorId] || null;
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
  // 默认返回tech-team
  return authors["tech-team"];
}

