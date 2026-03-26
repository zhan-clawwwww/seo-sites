#!/usr/bin/env node
/**
 * 微信公众号自动化发布脚本
 * 
 * 每天早上9:35执行，完成以下任务：
 * 1. 从当天SEO站点的24篇文章中精选3-5篇
 * 2. 将文章格式调整为微信公众号格式
 * 3. 准备发布到微信公众号草稿箱
 * 
 * 注意：由于微信公众号API需要敏感信息，且第三方skills存在安全风险，
 * 当前版本仅完成内容筛选和准备，发布功能需要后续集成微信官方API。
 */

import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// ============================================
// 配置
// ============================================

const WECHAT_CONFIG = {
  // 微信公众号相关配置（需要用户提供）
  appId: process.env.WECHAT_APP_ID || "需要设置WECHAT_APP_ID环境变量",
  appSecret: process.env.WECHAT_APP_SECRET || "需要设置WECHAT_APP_SECRET环境变量",
  
  // 内容筛选配置
  articleSelection: {
    minArticles: 3,      // 最少选择文章数
    maxArticles: 5,      // 最多选择文章数
    minWordCount: 1000,  // 最少字数要求
    qualityThreshold: 7, // 质量评分阈值（0-10）
  },
  
  // 发布时间配置
  publishTime: "09:35",  // 每天早上执行时间
};

// ============================================
// 文章评分模型
// ============================================

class ArticleScorer {
  /**
   * 为文章评分（0-10分）
   */
  static scoreArticle(articleContent, articlePath, siteSlug) {
    let score = 5.0; // 基础分
    
    // 1. 字数评分（20%权重）
    const wordCount = articleContent.length;
    const wordScore = Math.min(wordCount / 200, 2); // 2000字得满分2分
    score += wordScore * 0.2;
    
    // 2. 结构完整性评分（30%权重）
    const structureScore = this.scoreStructure(articleContent);
    score += structureScore * 0.3;
    
    // 3. 专栏相关性评分（20%权重）
    const relevanceScore = this.scoreRelevance(siteSlug);
    score += relevanceScore * 0.2;
    
    // 4. 引用质量评分（15%权重）
    const citationScore = this.scoreCitations(articleContent);
    score += citationScore * 0.15;
    
    // 5. 时效性评分（15%权重）
    const timelinessScore = this.scoreTimeliness(articlePath);
    score += timelinessScore * 0.15;
    
    return Math.min(Math.max(score, 0), 10); // 确保在0-10分之间
  }
  
  /**
   * 评分文章结构完整性
   */
  static scoreStructure(content) {
    let score = 0;
    
    // 检查是否包含必要章节
    const requiredSections = [
      "## 1.", "## 2.", "## 3.", "## 引用来源", "## 总结"
    ];
    
    requiredSections.forEach(section => {
      if (content.includes(section)) {
        score += 1;
      }
    });
    
    return Math.min(score / requiredSections.length, 1) * 10;
  }
  
  /**
   * 评分与公众号定位的相关性
   */
  static scoreRelevance(siteSlug) {
    // 公众号定位：科技、AI、产品评测、互联网趋势
    const relevanceMap = {
      "ai": 9,        // AI技术 - 高度相关
      "apple": 8,     // 苹果产品 - 高度相关
      "web3": 7,      // Web3技术 - 相关
      "tesla": 7,     // 特斯拉/电动汽车 - 相关
      "site-a": 6,    // SEO技术 - 中等相关
      "vpn-usa": 5,   // VPN服务 - 中等相关
      "streaming": 5, // 流媒体 - 中等相关
      "openclaw": 9,  // OpenClaw技术 - 高度相关
    };
    
    return relevanceMap[siteSlug] || 5;
  }
  
  /**
   * 评分引用质量
   */
  static scoreCitations(content) {
    const citationPattern = /\[.*?\]\(https?:\/\/[^\s)]+\)/g;
    const citations = content.match(citationPattern) || [];
    
    if (citations.length === 0) return 0;
    if (citations.length >= 3) return 10;
    
    return citations.length * 3; // 每1个引用得3分，最多10分
  }
  
  /**
   * 评分时效性
   */
  static scoreTimeliness(articlePath) {
    // 假设文件名包含日期：site-YYYY-MM-DD-...
    const dateMatch = articlePath.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (!dateMatch) return 5;
    
    const [_, year, month, day] = dateMatch;
    const articleDate = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    
    const diffDays = Math.floor((today - articleDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 10; // 今天
    if (diffDays === 1) return 8;  // 昨天
    if (diffDays <= 3) return 6;   // 3天内
    if (diffDays <= 7) return 4;   // 一周内
    return 2; // 超过一周
  }
}

// ============================================
// 文章筛选器
// ============================================

class ArticleSelector {
  /**
   * 从所有文章中筛选最适合微信公众号的文章
   */
  static selectArticles(allArticles, config = WECHAT_CONFIG.articleSelection) {
    // 1. 评分所有文章
    const scoredArticles = allArticles.map(article => ({
      ...article,
      score: ArticleScorer.scoreArticle(article.content, article.path, article.siteSlug),
    }));
    
    // 2. 按评分排序
    const sortedArticles = scoredArticles.sort((a, b) => b.score - a.score);
    
    // 3. 筛选质量达标文章
    const qualifiedArticles = sortedArticles.filter(
      article => article.score >= config.qualityThreshold
    );
    
    // 4. 选择文章数量
    const selectCount = Math.min(
      Math.max(config.minArticles, qualifiedArticles.length),
      config.maxArticles
    );
    
    return qualifiedArticles.slice(0, selectCount);
  }
  
  /**
   * 获取当天所有SEO站点文章
   */
  static getAllTodayArticles() {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
    const sitesDir = join(rootDir, "sites");
    const allArticles = [];
    
    // 获取所有站点目录
    const siteDirs = readdirSync(sitesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    // 遍历每个站点
    for (const siteSlug of siteDirs) {
      const postsDir = join(sitesDir, siteSlug, "posts");
      
      if (!existsSync(postsDir)) continue;
      
      // 查找当天文章
      const postFiles = readdirSync(postsDir)
        .filter(file => file.endsWith(".md") && file.includes(todayStr));
      
      // 读取文章内容
      for (const postFile of postFiles) {
        const postPath = join(postsDir, postFile);
        try {
          const content = readFileSync(postPath, "utf-8");
          allArticles.push({
            siteSlug,
            filename: postFile,
            path: postPath,
            content,
            wordCount: content.length,
            date: todayStr,
          });
        } catch (error) {
          console.warn(`读取文章失败: ${postPath}`, error.message);
        }
      }
    }
    
    return allArticles;
  }
}

// ============================================
// 微信公众号格式转换器
// ============================================

class WeChatFormatter {
  /**
   * 将Markdown文章转换为微信公众号格式
   */
  static formatForWeChat(article) {
    const { content, siteSlug, filename, score } = article;
    
    // 提取标题（从frontmatter或内容中）
    const title = this.extractTitle(content, filename);
    
    // 提取摘要
    const summary = this.extractSummary(content);
    
    // 转换内容格式
    const formattedContent = this.formatContent(content);
    
    // 添加微信公众号特定元素
    const wechatArticle = {
      title,
      summary,
      content: formattedContent,
      coverImage: this.generateCoverImage(siteSlug, title),
      tags: this.generateTags(siteSlug),
      originalScore: score.toFixed(1),
      originalSource: `SEO站点 - ${siteSlug}`,
      publishTime: new Date().toISOString(),
    };
    
    return wechatArticle;
  }
  
  /**
   * 提取文章标题
   */
  static extractTitle(content, filename) {
    // 尝试从frontmatter提取
    const frontmatterMatch = content.match(/title:\s*"([^"]+)"/);
    if (frontmatterMatch) {
      return frontmatterMatch[1];
    }
    
    // 尝试从第一行提取
    const lines = content.split("\n");
    for (const line of lines) {
      if (line.startsWith("# ")) {
        return line.substring(2).trim();
      }
    }
    
    // 从文件名生成
    const nameWithoutExt = filename.replace(".md", "");
    const words = nameWithoutExt.split("-").slice(3); // 去掉站点和日期部分
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  }
  
  /**
   * 提取文章摘要
   */
  static extractSummary(content) {
    // 提取第一段非标题内容
    const lines = content.split("\n");
    let inParagraph = false;
    const paragraphs = [];
    
    for (const line of lines) {
      if (line.trim().startsWith("#")) continue; // 跳过标题
      if (line.trim() === "") {
        if (inParagraph) break;
        continue;
      }
      
      paragraphs.push(line.trim());
      inParagraph = true;
    }
    
    const firstParagraph = paragraphs.join(" ");
    return firstParagraph.length > 150 
      ? firstParagraph.substring(0, 150) + "..."
      : firstParagraph;
  }
  
  /**
   * 格式化内容
   */
  static formatContent(content) {
    let formatted = content;
    
    // 1. 移除frontmatter
    formatted = formatted.replace(/---[\s\S]*?---\n*/, "");
    
    // 2. 调整标题级别（公众号喜欢小标题）
    formatted = formatted.replace(/^# /gm, "## ");
    formatted = formatted.replace(/^## /gm, "### ");
    
    // 3. 添加段落间距
    formatted = formatted.replace(/\n\n/g, "\n\n　　");
    
    // 4. 添加版权声明
    formatted += "\n\n---\n\n";
    formatted += "*本文由AI助手自动筛选并格式化，精选自当日SEO站点原创文章。*";
    formatted += "\n*发布时间：" + new Date().toLocaleString("zh-CN") + "*";
    
    return formatted;
  }
  
  /**
   * 生成封面图（占位符，实际需要真实图片）
   */
  static generateCoverImage(siteSlug, title) {
    // 根据站点生成封面图关键词
    const siteImages = {
      "ai": "人工智能 科技 未来",
      "apple": "苹果 iPhone 科技产品",
      "tesla": "特斯拉 电动汽车 未来交通",
      "web3": "区块链 加密货币 去中心化",
      "openclaw": "AI助手 自动化 机器人",
    };
    
    const keywords = siteImages[siteSlug] || "科技 互联网 创新";
    return `https://placehold.co/800x400/3b82f6/ffffff?text=${encodeURIComponent(keywords)}`;
  }
  
  /**
   * 生成标签
   */
  static generateTags(siteSlug) {
    const tagMap = {
      "ai": ["人工智能", "机器学习", "科技前沿"],
      "apple": ["苹果", "iPhone", "科技产品", "评测"],
      "tesla": ["特斯拉", "电动汽车", "新能源", "科技创新"],
      "web3": ["区块链", "加密货币", "Web3", "去中心化"],
      "site-a": ["SEO", "网站优化", "数字营销"],
      "vpn-usa": ["VPN", "网络安全", "隐私保护"],
      "streaming": ["流媒体", "Netflix", "娱乐科技"],
      "openclaw": ["AI助手", "自动化", "工作效率", "OpenClaw"],
    };
    
    return tagMap[siteSlug] || ["科技", "互联网", "创新"];
  }
}

// ============================================
// 主函数
// ============================================

async function main() {
  console.log("=".repeat(60));
  console.log("🚀 微信公众号自动化发布任务");
  console.log(`时间: ${new Date().toLocaleString("zh-CN")}`);
  console.log("=".repeat(60));
  
  // 1. 获取当天所有文章
  console.log("\n📚 步骤1: 获取当天SEO站点文章...");
  const allArticles = ArticleSelector.getAllTodayArticles();
  console.log(`   找到 ${allArticles.length} 篇文章`);
  
  if (allArticles.length === 0) {
    console.log("❌ 没有找到当天文章，任务结束");
    return;
  }
  
  // 2. 筛选最适合微信公众号的文章
  console.log("\n🔍 步骤2: 筛选适合微信公众号的文章...");
  const selectedArticles = ArticleSelector.selectArticles(allArticles);
  console.log(`   筛选出 ${selectedArticles.length} 篇文章`);
  
  // 显示筛选结果
  selectedArticles.forEach((article, index) => {
    console.log(`   ${index + 1}. [${article.siteSlug}] ${article.filename}`);
    console.log(`      评分: ${article.score.toFixed(1)}/10，字数: ${article.wordCount}`);
  });
  
  // 3. 转换为微信公众号格式
  console.log("\n🔄 步骤3: 转换为微信公众号格式...");
  const wechatArticles = selectedArticles.map(article => 
    WeChatFormatter.formatForWeChat(article)
  );
  
  // 4. 保存结果
  console.log("\n💾 步骤4: 保存筛选结果...");
  const outputDir = join(rootDir, "wechat-output");
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }
  
  const today = new Date().toISOString().slice(0, 10);
  const outputFile = join(outputDir, `wechat-articles-${today}.json`);
  
  const outputData = {
    date: today,
    selectionTime: new Date().toISOString(),
    totalArticles: allArticles.length,
    selectedCount: selectedArticles.length,
    articles: wechatArticles,
    config: WECHAT_CONFIG,
  };
  
  writeFileSync(outputFile, JSON.stringify(outputData, null, 2), "utf-8");
  console.log(`   结果已保存: ${outputFile}`);
  
  // 5. 生成报告
  console.log("\n📊 步骤5: 生成执行报告...");
  const report = generateReport(allArticles, selectedArticles, wechatArticles);
  console.log(report);
  
  console.log("\n" + "=".repeat(60));
  console.log("✅ 微信公众号自动化任务完成");
  console.log("=".repeat(60));
  console.log("\n💡 下一步:");
  console.log("   1. 获取微信公众号AppID和AppSecret");
  console.log("   2. 集成微信官方API实现自动发布");
  console.log("   3. 在手机上确认发布筛选的文章");
}

// ============================================
// 报告生成
// ============================================

function generateReport(allArticles, selectedArticles, wechatArticles) {
  let report = "";
  
  // 统计信息
  const siteStats = {};
  allArticles.forEach(article => {
    siteStats[article.siteSlug] = (siteStats[article.siteSlug] || 0) + 1;
  });
  
  const selectedStats = {};
  selectedArticles.forEach(article => {
    selectedStats[article.siteSlug] = (selectedStats[article.siteSlug] || 0) + 1;
  });
  
  report += "📈 统计信息:\n";
  report += `   总文章数: ${allArticles.length}\n`;
  report += `   筛选文章: ${selectedArticles.length}\n`;
  report += `   筛选比例: ${((selectedArticles.length / allArticles.length) * 100).toFixed(1)}%\n`;
  
  report += "\n🏷️ 各专栏文章分布:\n";
  Object.entries(siteStats).forEach(([site, count]) => {
    const selectedCount = selectedStats[site] || 0;
    const selectionRate = selectedCount > 0 ? ((selectedCount / count) * 100).toFixed(1) : "0";
    report += `   ${site}: ${count}篇 → 选中${selectedCount}篇 (${selectionRate}%)\n`;
  });
  
  report += "\n🏆 精选文章详情:\n";
  wechatArticles.forEach((article, index) => {
    report += `   ${index + 1}. ${article.title}\n`;
    report += `      来源: ${article.originalSource}\n`;
    report += `      评分: ${article.originalScore}/10\n`;
    report += `      标签: ${article.tags.join(", ")}\n`;
  });
  
  report += "\n⚠️ 注意事项:\n";
  report += "   1. 当前版本仅完成内容筛选和格式化\n";
  report += "   2. 需要集成微信官方API实现自动发布\n";
  report += "   3. 需要在手机上确认最终发布\n";
  report += "   4. 封面图为占位符，建议替换为真实图片\n";
  
  return report;
}

// ============================================
// 执行
// ============================================

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error("❌ 任务执行失败:", error.message);
    process.exit(1);
  });
}

export {
  ArticleScorer,
  ArticleSelector,
  WeChatFormatter,
  WECHAT_CONFIG,
};