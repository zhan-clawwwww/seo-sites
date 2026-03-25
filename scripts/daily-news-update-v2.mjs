#!/usr/bin/env node
/**
 * 每日新闻采集脚本 V2 (支持多站点自动搜索)
 *
 * 功能：
 * 1. 为所有专栏搜索当天最新新闻
 * 2. 基于搜索结果创作原创总结文章
 * 3. 每个专栏每天生成5篇原创文章
 * 4. Git提交并推送
 *
 * 使用方法：
 *   node scripts/daily-news-update-v2.mjs
 *   node scripts/daily-news-update-v2.mjs --dry-run     # 测试模式，不写入文件
 *   node scripts/daily-news-update-v2.mjs --skip-build  # 跳过编译检查
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// ============================================
// 配置 - 所有专栏
// ============================================

const SITES_CONFIG = {
  ai: {
    name: "AI News",
    keywords: [
      "AI news 2026", "artificial intelligence breakthrough", 
      "OpenAI Google Anthropic news", "LLM latest", "machine learning research",
      "AI chips", "neural networks", "deep learning", "AI applications"
    ],
    descriptionPrefix: "Latest AI news and breakthroughs: ",
    author: "ai-agent"
  },
  apple: {
    name: "Apple Devices", 
    keywords: [
      "Apple device 2026", "iPhone news 2026", "MacBook news 2026", 
      "Apple product launch", "iOS updates", "macOS news", "Apple Watch",
      "iPad Pro", "Apple silicon", "Apple services"
    ],
    descriptionPrefix: "Apple product updates and news: ",
    author: "apple-agent"
  },
  streaming: {
    name: "Streaming Services",
    keywords: [
      "Netflix news 2026", "Disney Plus updates", "HBO Max new releases",
      "streaming services", "4K streaming", "OTT platforms", "live streaming",
      "video on demand", "streaming technology", "content delivery"
    ],
    descriptionPrefix: "Streaming service updates and technology: ",
    author: "streaming-agent"
  },
  tesla: {
    name: "Tesla News",
    keywords: [
      "Tesla news 2026", "Tesla vehicles", "Elon Musk updates", 
      "electric vehicles", "EV technology", "Tesla battery", "Autopilot",
      "Tesla charging", "sustainable energy", "Tesla software updates"
    ],
    descriptionPrefix: "Tesla and electric vehicle news: ",
    author: "tesla-agent"
  },
  "vpn-usa": {
    name: "VPN Services",
    keywords: [
      "VPN news 2026", "online privacy", "internet security", 
      "best VPN services", "encryption technology", "data protection",
      "cybersecurity", "anonymous browsing", "secure connections"
    ],
    descriptionPrefix: "VPN and online privacy news: ",
    author: "vpn-agent"
  },
  web3: {
    name: "Web3 Technology",
    keywords: [
      "Web3 news 2026", "blockchain technology", "cryptocurrency updates",
      "DeFi platforms", "NFT marketplace", "decentralized applications",
      "smart contracts", "metaverse news", "digital assets"
    ],
    descriptionPrefix: "Web3 and blockchain technology news: ",
    author: "web3-agent"
  },
  "site-a": {
    name: "SEO Technology",
    keywords: [
      "SEO news 2026", "search engine optimization", "Google algorithm updates",
      "content marketing", "website analytics", "digital marketing trends",
      "search ranking", "technical SEO", "link building strategies"
    ],
    descriptionPrefix: "SEO and digital marketing news: ",
    author: "seo-agent"
  }
};

const GIT_CONFIG = {
  authorName: "Matrix Agent",
  authorEmail: "agent@matrix.ai"
};

const ARTICLE_CONFIG = {
  articlesPerSite: 5,          // 每个专栏每天5篇文章
  maxSearchResults: 10,        // 每个关键词最多搜索结果
  minArticleLength: 800,       // 最小文章长度
  maxArticleLength: 2000       // 最大文章长度
};

// ============================================
// 工具函数
// ============================================

function log(message, type = "info") {
  const timestamp = new Date().toISOString();
  const icons = { info: "ℹ️", success: "✅", warning: "⚠️", error: "❌" };
  console.log(`${icons[type]} [${timestamp}] ${message}`);
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 60);
}

function generateFilename(siteSlug, title) {
  const date = new Date().toISOString().slice(0, 10);
  const slug = slugify(title);
  return `${siteSlug}-${date}-${slug}.md`.substring(0, 80);
}

function formatDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function generateMarkdown(frontmatter, content) {
  const lines = ["---"];
  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map(v => `"${v}"`).join(", ")}]`);
    } else {
      lines.push(`${key}: "${value}"`);
    }
  }
  lines.push("---", "", content);
  return lines.join("\n");
}

function execCommand(command, cwd = rootDir) {
  try {
    const output = execSync(command, {
      cwd,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 120000
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// 模拟网络搜索函数
// ============================================

/**
 * 模拟搜索新闻 - 在真实环境中需要替换为实际的搜索API
 * 这里返回模拟数据用于测试
 */
async function searchNewsMock(query, siteSlug) {
  log(`[模拟搜索] "${query}" (${siteSlug})`, "info");
  
  // 模拟搜索结果
  const mockResults = {
    ai: [
      {
        title: "Next-Generation AI Processors Announced",
        snippet: "Major tech companies unveil new AI chips with 50% performance improvement",
        url: "https://example.com/ai-chip-news",
        date: formatDate()
      },
      {
        title: "AI Language Models Break New Ground",
        snippet: "Latest language models achieve human-level performance on complex reasoning tasks",
        url: "https://example.com/ai-language-models",
        date: formatDate()
      }
    ],
    apple: [
      {
        title: "iPhone 17 Pro Max Specifications Leaked",
        snippet: "Detailed specifications of the upcoming iPhone 17 Pro Max revealed by insiders",
        url: "https://example.com/iphone-leaks",
        date: formatDate()
      },
      {
        title: "Apple M5 Chip Performance Benchmarks",
        snippet: "Early benchmarks show significant performance improvements in Apple's M5 processors",
        url: "https://example.com/apple-m5-benchmarks",
        date: formatDate()
      }
    ],
    tesla: [
      {
        title: "Tesla Model 3 Refresh 2026 Review",
        snippet: "Detailed review of the 2026 Tesla Model 3 with upgraded battery and Autopilot",
        url: "https://example.com/tesla-model-3-review",
        date: formatDate()
      },
      {
        title: "Tesla Battery Technology Breakthrough",
        snippet: "Tesla announces new battery technology with 40% longer range and faster charging",
        url: "https://example.com/tesla-battery-tech",
        date: formatDate()
      }
    ],
    streaming: [
      {
        title: "Netflix 4K Streaming Quality Improvements",
        snippet: "Netflix announces enhanced 4K streaming with better compression and quality",
        url: "https://example.com/netflix-4k",
        date: formatDate()
      },
      {
        title: "Disney Plus New Original Content",
        snippet: "Disney Plus unveils new original series and movies for 2026 lineup",
        url: "https://example.com/disney-plus-content",
        date: formatDate()
      }
    ],
    "vpn-usa": [
      {
        title: "VPN Security Standards Updated for 2026",
        snippet: "New security standards and protocols for VPN services announced",
        url: "https://example.com/vpn-security-standards",
        date: formatDate()
      },
      {
        title: "Best VPN Services for Privacy Protection",
        snippet: "Comprehensive review of top VPN services focusing on privacy features",
        url: "https://example.com/best-vpn-privacy",
        date: formatDate()
      }
    ],
    web3: [
      {
        title: "Blockchain Interoperability Solutions",
        snippet: "New solutions for cross-chain interoperability and communication",
        url: "https://example.com/blockchain-interoperability",
        date: formatDate()
      },
      {
        title: "DeFi Platform Security Enhancements",
        snippet: "Major DeFi platforms implement enhanced security measures and protocols",
        url: "https://example.com/defi-security",
        date: formatDate()
      }
    ],
    "site-a": [
      {
        title: "Google Algorithm Update 2026 Analysis",
        snippet: "Detailed analysis of the latest Google algorithm update and its impact",
        url: "https://example.com/google-algorithm-update",
        date: formatDate()
      },
      {
        title: "SEO Best Practices for 2026",
        snippet: "Updated SEO strategies and best practices for the current year",
        url: "https://example.com/seo-best-practices",
        date: formatDate()
      }
    ]
  };

  // 返回模拟结果
  await new Promise(resolve => setTimeout(resolve, 500)); // 模拟网络延迟
  
  const results = mockResults[siteSlug] || [];
  return results.slice(0, ARTICLE_CONFIG.maxSearchResults);
}

// ============================================
// 文章生成函数
// ============================================

/**
 * 基于搜索结果生成原创总结文章
 */
function generateOriginalArticle(searchResults, siteConfig, siteSlug) {
  if (!searchResults || searchResults.length === 0) {
    return null;
  }

  const siteName = siteConfig.name;
  const today = formatDate();
  
  // 从搜索结果中提取关键信息
  const titles = searchResults.map(r => r.title);
  const snippets = searchResults.map(r => r.snippet);
  
  // 生成原创标题（基于搜索结果但不直接复制）
  const titleOptions = [
    `Latest ${siteName} Developments and News Analysis`,
    `${siteName} Industry Updates and Technology Trends`,
    `Current ${siteName} Market Analysis and Insights`,
    `${siteName} Innovations and Future Outlook`,
    `Comprehensive ${siteName} News Roundup and Analysis`
  ];
  
  const title = titleOptions[Math.floor(Math.random() * titleOptions.length)];
  
  // 生成原创描述
  const description = `${siteConfig.descriptionPrefix}Analysis of recent developments, trends, and important updates in the ${siteName.toLowerCase()} industry.`;
  
  // 生成原创内容
  const content = generateArticleContent(searchResults, siteSlug);
  
  // 生成关键词
  const keywords = generateKeywords(siteConfig.keywords, searchResults);
  
  return {
    title,
    description,
    content,
    keywords,
    pubDate: today,
    author: siteConfig.author,
    topic: `${siteSlug}-news`
  };
}

/**
 * 生成文章内容
 */
function generateArticleContent(searchResults, siteSlug) {
  let content = `# Industry Analysis and News Summary\n\n`;
  
  // 简介段落
  content += `The ${SITES_CONFIG[siteSlug].name.toLowerCase()} sector continues to evolve with significant developments across multiple areas. Based on recent news and industry analysis, here are the key updates and trends worth noting.\n\n`;
  
  // 为每个搜索结果创建原创分析段落
  searchResults.forEach((result, index) => {
    content += `## ${index + 1}. ${result.title.replace(/^[^a-zA-Z]*/, '')}\n\n`;
    
    // 基于snippet生成原创分析
    const analysis = generateAnalysisFromSnippet(result.snippet, siteSlug);
    content += `${analysis}\n\n`;
    
    // 添加影响分析
    content += `**Industry Impact:** This development has implications for ${getImpactArea(siteSlug)} and may influence ${getInfluenceAreas(siteSlug)} in the coming months.\n\n`;
  });
  
  // 添加总结段落
  content += `## Summary and Outlook\n\n`;
  content += generateSummary(siteSlug, searchResults.length);
  
  // 添加技术细节（如果适用）
  if (["ai", "tesla", "web3", "site-a"].includes(siteSlug)) {
    content += `\n## Technical Considerations\n\n`;
    content += getTechnicalConsiderations(siteSlug);
  }
  
  return content;
}

/**
 * 基于snippet生成原创分析
 */
function generateAnalysisFromSnippet(snippet, siteSlug) {
  const snippets = snippet.split(/[.!?]+/).filter(s => s.trim().length > 10);
  if (snippets.length === 0) return "Recent developments indicate continued innovation and progress in this sector.";
  
  const mainPoint = snippets[0].trim();
  
  // 改写为原创分析
  const analysisTemplates = [
    `Analysis suggests that ${mainPoint.toLowerCase()} represents a significant advancement in the field.`,
    `Industry experts note that ${mainPoint.toLowerCase()} demonstrates the ongoing evolution of ${getIndustryTerm(siteSlug)}.`,
    `The announcement regarding ${mainPoint.toLowerCase()} highlights the competitive landscape and innovation pace.`,
    `This development around ${mainPoint.toLowerCase()} underscores important trends in ${getTrendArea(siteSlug)}.`,
    `Recent reports indicate that ${mainPoint.toLowerCase()} could have substantial implications for the broader market.`
  ];
  
  return analysisTemplates[Math.floor(Math.random() * analysisTemplates.length)];
}

/**
 * 生成关键词
 */
function generateKeywords(baseKeywords, searchResults) {
  const keywords = [...baseKeywords.slice(0, 3)];
  
  // 从搜索结果标题中提取额外关键词
  searchResults.slice(0, 2).forEach(result => {
    const words = result.title.toLowerCase().split(/\s+/);
    words.forEach(word => {
      if (word.length > 4 && /^[a-z]+$/.test(word) && !keywords.includes(word)) {
        keywords.push(word);
      }
    });
  });
  
  // 添加年份关键词
  const currentYear = new Date().getFullYear();
  keywords.push(`${currentYear} updates`);
  
  return keywords.slice(0, 8); // 限制关键词数量
}

// ============================================
// 辅助函数
// ============================================

function getImpactArea(siteSlug) {
  const impactAreas = {
    ai: "AI research, commercial applications, and technology development",
    apple: "consumer electronics, mobile technology, and software ecosystems",
    tesla: "electric vehicle adoption, sustainable energy, and automotive technology",
    streaming: "content delivery, entertainment consumption, and digital media",
    "vpn-usa": "online privacy, cybersecurity, and internet infrastructure",
    web3: "decentralized finance, digital asset markets, and blockchain applications",
    "site-a": "search visibility, digital marketing strategies, and online presence"
  };
  return impactAreas[siteSlug] || "the industry landscape";
}

function getInfluenceAreas(siteSlug) {
  const influenceAreas = {
    ai: "future research directions and commercial implementations",
    apple: "product development cycles and consumer expectations",
    tesla: "EV market competition and charging infrastructure",
    streaming: "content licensing agreements and viewer preferences",
    "vpn-usa": "privacy regulations and security standards",
    web3: "regulatory frameworks and technological adoption",
    "site-a": "search engine algorithms and content strategies"
  };
  return influenceAreas[siteSlug] || "industry standards and practices";
}

function getIndustryTerm(siteSlug) {
  const terms = {
    ai: "artificial intelligence technology",
    apple: "consumer technology products",
    tesla: "electric vehicle technology",
    streaming: "digital content delivery",
    "vpn-usa": "online privacy solutions",
    web3: "decentralized technology",
    "site-a": "search optimization practices"
  };
  return terms[siteSlug] || "this technology sector";
}

function getTrendArea(siteSlug) {
  const trends = {
    ai: "machine learning applications and AI integration",
    apple: "mobile computing and ecosystem development",
    tesla: "sustainable transportation and energy solutions",
    streaming: "digital entertainment and subscription models",
    "vpn-usa": "data protection and internet freedom",
    web3: "decentralization and digital ownership",
    "site-a": "online visibility and content discovery"
  };
  return trends[siteSlug] || "industry innovation";
}

function generateSummary(siteSlug, numResults) {
  const summaries = {
    ai: `The artificial intelligence sector shows robust activity with ${numResults} significant developments analyzed. Continued investment in AI research and applications suggests sustained growth and innovation in this rapidly evolving field.`,
    apple: `Apple's product ecosystem continues to evolve with ${numResults} key updates examined. The company's focus on hardware-software integration and user experience remains central to its market strategy.`,
    tesla: `Electric vehicle technology advances with ${numResults} important Tesla-related developments. The intersection of sustainable energy, automotive innovation, and software integration defines current industry trends.`,
    streaming: `Streaming services demonstrate ongoing innovation with ${numResults} notable updates. Content delivery technology, licensing models, and user experience improvements remain competitive differentiators.`,
    "vpn-usa": `Online privacy and security concerns drive ${numResults} significant VPN-related developments. Encryption standards, privacy regulations, and user protection measures continue to evolve.`,
    web3: `Decentralized technology progresses with ${numResults} blockchain and Web3 developments. Smart contract applications, digital asset management, and decentralized governance show continued maturation.`,
    "site-a": `Search optimization strategies adapt with ${numResults} SEO-related developments. Algorithm changes, content quality standards, and technical optimization remain critical for online visibility.`
  };
  
  return summaries[siteSlug] || `The sector shows continued development with ${numResults} significant updates analyzed, indicating ongoing innovation and market evolution.`;
}

function getTechnicalConsiderations(siteSlug) {
  const considerations = {
    ai: "Technical implementation requires consideration of computational resources, data quality, model training methodologies, and ethical AI guidelines. Performance optimization and scalability remain important challenges.",
    tesla: "EV technology considerations include battery chemistry, charging infrastructure compatibility, software update management, and autonomous driving system reliability. Thermal management and energy efficiency are key technical factors.",
    web3: "Blockchain implementation involves smart contract security, consensus mechanism efficiency, cross-chain interoperability, and scalability solutions. Gas optimization and network congestion management are ongoing technical challenges.",
    "site-a": "SEO implementation requires attention to page load performance, mobile responsiveness, structured data markup, and core web vitals. Technical debt management and website architecture optimization impact search visibility."
  };
  
  return considerations[siteSlug] || "Technical implementation requires careful consideration of performance requirements, scalability needs, and compatibility with existing systems and standards.";
}

// ============================================
// 文件操作函数
// ============================================

function getExistingSlugs(siteSlug) {
  const postsDir = join(rootDir, "sites", siteSlug, "posts");
  if (!existsSync(postsDir)) {
    mkdirSync(postsDir, { recursive: true });
    return [];
  }
  return readdirSync(postsDir)
    .filter(f => f.endsWith(".md"))
    .map(f => f.replace(/\.md$/, ""));
}

function saveArticle(siteSlug, articleData, dryRun = false) {
  const { title, description, content, keywords, pubDate, author, topic } = articleData;
  const filename = generateFilename(siteSlug, title);
  
  if (dryRun) {
    log(`[DRY RUN] 会保存: ${filename}`, "info");
    return { success: true, filename, skipped: false };
  }

  const postsDir = join(rootDir, "sites", siteSlug, "posts");
  if (!existsSync(postsDir)) {
    mkdirSync(postsDir, { recursive: true });
  }

  const filepath = join(postsDir, filename);
  
  const frontmatter = {
    title,
    description,
    keywords,
    pubDate,
    author,
    topic
  };
  
  const markdown = generateMarkdown(frontmatter, content);
  
  // 检查是否已存在相同标题的文章
  const existingSlugs = getExistingSlugs(siteSlug);
  const articleSlug = filename.replace(".md", "");
  
  if (existingSlugs.includes(articleSlug)) {
    log(`跳过已存在: ${title.substring(0, 50)}...`, "warning");
    return { success: false, filename, skipped: true };
  }
  
  writeFileSync(filepath, markdown, "utf-8");
  log(`已保存: ${filename}`, "success");
  
  return { success: true, filename, filepath, skipped: false };
}

// ============================================
// Git操作
// ============================================

function gitCommit(message) {
  execCommand(`git config user.name "${GIT_CONFIG.authorName}"`);
  execCommand(`git config user.email "${GIT_CONFIG.authorEmail}"`);

  const addResult = execCommand("git add -A");
  if (!addResult.success) {
    log(`Git add失败: ${addResult.error}`, "error");
    return false;
  }

  const statusResult = execCommand("git status --porcelain");
  if (!statusResult.output?.trim()) {
    log("没有需要提交的更改", "warning");
    return true;
  }

  const commitResult = execCommand(`git commit -m "${message}"`);
  if (!commitResult.success) {
    log(`Git commit失败: ${commitResult.error}`, "error");
    return false;
  }

  log("Git提交成功", "success");
  return true;
}

function gitPush() {
  log("开始Git推送...");
  const result = execCommand("git push");

  if (!result.success) {
    log(`Git push失败: ${result.error}`, "error");
    return false;
  }

  log("Git推送成功", "success");
  return true;
}

// ============================================
// 编译检查
// ============================================

function runBuildCheck() {
  log("运行编译检查...");
  const result = execCommand("npm run build");
  
  if (!result.success) {
    log(`编译失败: ${result.error}`, "error");
    return false;
  }
  
  log("编译检查通过", "success");
  return true;
}

// ============================================
// 主流程
// ============================================

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const skipBuild = args.includes("--skip-build");
  
  const today = formatDate();
  
  log("========================================");
  log("🚀 开始每日新闻更新任务 V2");
  log(`日期: ${today}`);
  log(`模式: ${dryRun ? "测试模式 (不写入文件)" : "生产模式"}`);
  log("========================================");
  
  const allNewArticles = [];
  const siteStats = {};
  
  // 处理每个专栏
  for (const [siteSlug, siteConfig] of Object.entries(SITES_CONFIG)) {
    log(`\n📊 处理专栏: ${siteConfig.name} (${siteSlug})`);
    
    const newArticles = [];
    const existingSlugs = getExistingSlugs(siteSlug);
    
    // 特斯拉专栏特殊处理：10篇文章，其他专栏5篇
    const articlesPerSite = siteSlug === "tesla" ? 10 : ARTICLE_CONFIG.articlesPerSite;
    
    // 为每个关键词搜索新闻
    for (let i = 0; i < articlesPerSite; i++) {
      const keywordIndex = i % siteConfig.keywords.length;
      const keyword = siteConfig.keywords[keywordIndex];
      
      log(`  搜索: "${keyword}"`);
      
      try {
        // 搜索新闻（这里使用模拟搜索，实际需要替换为真实搜索）
        const searchResults = await searchNewsMock(keyword, siteSlug);
        
        if (searchResults.length > 0) {
          // 生成原创文章
          const articleData = generateOriginalArticle(searchResults, siteConfig, siteSlug);
          
          if (articleData) {
            // 保存文章
            const saveResult = saveArticle(siteSlug, articleData, dryRun);
            
            if (saveResult.success && !saveResult.skipped) {
              newArticles.push({
                site: siteSlug,
                title: articleData.title,
                filename: saveResult.filename
              });
              
              log(`  生成文章: ${articleData.title.substring(0, 50)}...`);
            }
          }
        }
        
        // 避免请求过快
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        log(`  搜索失败: ${error.message}`, "error");
      }
    }
    
    siteStats[siteSlug] = newArticles.length;
    allNewArticles.push(...newArticles);
    
    log(`  ✅ 完成: ${newArticles.length}/${articlesPerSite} 篇文章`);
  }
  
  // 统计信息
  log("\n========================================");
  log("📊 任务执行完成");
  log("========================================");
  
  let totalArticles = 0;
  let totalExpected = 0;
  
  for (const [siteSlug, count] of Object.entries(siteStats)) {
    const expected = siteSlug === "tesla" ? 10 : 5;
    totalExpected += expected;
    log(`${SITES_CONFIG[siteSlug].name}: ${count}/${expected} 篇文章`);
    totalArticles += count;
  }
  
  log(`总计: ${totalArticles}/${totalExpected} 篇新文章`);
  
  if (allNewArticles.length > 0) {
    log("\n新增文章列表:");
    allNewArticles.slice(0, 10).forEach(article => {
      log(`  - [${article.site}] ${article.title.substring(0, 50)}...`);
    });
    
    if (allNewArticles.length > 10) {
      log(`  还有 ${allNewArticles.length - 10} 篇文章未列出`);
    }
    
    if (!dryRun) {
      // 编译检查
      if (!skipBuild) {
        log("\n🔧 运行编译检查...");
        const buildSuccess = runBuildCheck();
        
        if (!buildSuccess) {
          log("编译失败，停止执行", "error");
          return;
        }
      }
      
      // Git提交
      log("\n📦 开始Git操作...");
      const commitMessage = `Daily update ${today}: Add ${totalArticles} articles across all sites`;
      
      if (gitCommit(commitMessage)) {
        log("\n✅ 文章已成功提交到本地仓库");
        log("\n💡 注意: 需要飞书确认后才能推送到GitHub");
        log("   请在飞书中回复 '推送' 以执行推送操作");
        log(`   推送命令: cd ${rootDir} && git push origin main`);
      }
    } else {
      log("\n⚠️ DRY RUN模式，跳过实际文件操作和Git提交", "warning");
    }
  } else {
    log("\n没有新增文章，跳过后续操作", "info");
  }
  
  log("\n========================================");
  log("✅ 任务完成");
  log("========================================");
}

// 运行主函数
main().catch(error => {
  log(`任务执行失败: ${error.message}`, "error");
  process.exit(1);
});