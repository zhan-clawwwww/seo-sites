#!/usr/bin/env node
/**
 * 微信公众号API安全客户端
 * 
 * 功能：
 * 1. 安全的API凭证管理
 * 2. 合理的内容排版
 * 3. 安全的发布流程
 * 4. 错误处理和日志记录
 * 
 * 原则：安全第一，合理排版，不乱发布
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createHash } from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// ============================================
// 配置加载
// ============================================

class WeChatConfig {
  static loadConfig() {
    const envPath = join(rootDir, "wechat.env");
    
    if (!existsSync(envPath)) {
      throw new Error("找不到微信公众号配置文件: wechat.env");
    }
    
    const envContent = readFileSync(envPath, "utf-8");
    const config = {};
    
    envContent.split("\n").forEach(line => {
      line = line.trim();
      if (line && !line.startsWith("#")) {
        const [key, value] = line.split("=");
        if (key && value) {
          config[key.trim()] = value.trim();
        }
      }
    });
    
    // 验证必要配置
    const requiredKeys = ["WECHAT_APP_ID", "WECHAT_APP_SECRET"];
    for (const key of requiredKeys) {
      if (!config[key]) {
        throw new Error(`缺少必要配置: ${key}`);
      }
    }
    
    // 敏感信息脱敏记录
    const safeConfig = { ...config };
    safeConfig.WECHAT_APP_SECRET = "***" + config.WECHAT_APP_SECRET.slice(-4);
    
    console.log("✅ 微信公众号配置加载成功");
    console.log(`   应用ID: ${config.WECHAT_APP_ID}`);
    console.log(`   密钥: ${safeConfig.WECHAT_APP_SECRET}`);
    console.log(`   发布到草稿箱: ${config.WECHAT_PUBLISH_TO_DRAFT === "true"}`);
    console.log(`   每天文章数: ${config.WECHAT_ARTICLE_COUNT}`);
    
    return config;
  }
}

// ============================================
// 内容排版器
// ============================================

class WeChatFormatter {
  /**
   * 确保内容合理排版
   */
  static formatContent(content, options = {}) {
    const {
      titleMaxLength = 30,
      summaryMaxLength = 150,
      requireSections = ["热点概述", "技术分析", "行业影响", "未来展望", "引用来源"],
    } = options;
    
    let formatted = content;
    
    // 1. 检查并确保标题合理
    formatted = this.formatTitle(formatted, titleMaxLength);
    
    // 2. 检查并确保摘要合理
    formatted = this.formatSummary(formatted, summaryMaxLength);
    
    // 3. 检查并确保章节完整
    formatted = this.ensureSections(formatted, requireSections);
    
    // 4. 标准化段落格式
    formatted = this.normalizeParagraphs(formatted);
    
    // 5. 添加合理的间距
    formatted = this.addReasonableSpacing(formatted);
    
    // 6. 清理多余空白
    formatted = this.cleanExtraWhitespace(formatted);
    
    return formatted;
  }
  
  /**
   * 格式化标题
   */
  static formatTitle(content, maxLength) {
    // 提取标题（假设第一行是标题）
    const lines = content.split("\n");
    let title = lines[0].trim();
    
    // 移除标题标记
    title = title.replace(/^#+\s*/, "");
    
    // 检查标题长度
    if (title.length > maxLength) {
      console.warn(`⚠️ 标题过长: ${title.length}字符 > ${maxLength}字符`);
      title = title.substring(0, maxLength - 3) + "...";
    }
    
    // 检查标题合理性
    if (title.length < 5) {
      console.warn(`⚠️ 标题过短: ${title.length}字符`);
      title = "科技热点分析：" + title;
    }
    
    // 更新内容
    lines[0] = `# ${title}`;
    return lines.join("\n");
  }
  
  /**
   * 格式化摘要
   */
  static formatSummary(content, maxLength) {
    const lines = content.split("\n");
    
    // 查找摘要（通常在标题后的第一段）
    let summary = "";
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && !line.startsWith("#")) {
        summary = line;
        break;
      }
    }
    
    // 如果没有摘要，从内容中生成
    if (!summary || summary.length < 20) {
      summary = this.generateSummary(content);
    }
    
    // 限制摘要长度
    if (summary.length > maxLength) {
      summary = summary.substring(0, maxLength - 3) + "...";
    }
    
    // 确保摘要合理
    if (summary.length < 30) {
      summary = "本文分析了当前科技热点，探讨了技术发展和行业影响。";
    }
    
    return content; // 摘要通常在frontmatter中，这里保持原样
  }
  
  /**
   * 生成摘要
   */
  static generateSummary(content) {
    // 提取关键句子作为摘要
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
    
    if (sentences.length >= 2) {
      return sentences[0].trim() + " " + sentences[1].trim();
    } else if (sentences.length === 1) {
      return sentences[0].trim();
    }
    
    return "深度分析当前科技热点，探讨技术突破和行业趋势。";
  }
  
  /**
   * 确保章节完整
   */
  static ensureSections(content, requiredSections) {
    let hasAllSections = true;
    const missingSections = [];
    
    for (const section of requiredSections) {
      const pattern = new RegExp(`^##\\s+${section}`);
      if (!content.match(pattern)) {
        hasAllSections = false;
        missingSections.push(section);
      }
    }
    
    if (!hasAllSections) {
      console.warn(`⚠️ 缺少必要章节: ${missingSections.join(", ")}`);
      
      // 添加缺失的章节
      let formatted = content;
      for (const section of missingSections) {
        formatted += `\n\n## ${section}\n\n*内容正在准备中...*`;
      }
      
      return formatted;
    }
    
    return content;
  }
  
  /**
   * 标准化段落格式
   */
  static normalizeParagraphs(content) {
    return content
      .replace(/\n{3,}/g, "\n\n")  // 最多两个空行
      .replace(/^\s+$/gm, "")       // 移除纯空白行
      .replace(/\t/g, "    ")       // 制表符转空格
      .replace(/[ \t]+$/gm, "");    // 移除行尾空白
  }
  
  /**
   * 添加合理的间距
   */
  static addReasonableSpacing(content) {
    const lines = content.split("\n");
    const formattedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      formattedLines.push(lines[i]);
      
      // 在章节标题后添加空行
      if (lines[i].match(/^##\s+/)) {
        formattedLines.push("");
      }
      
      // 在长段落间添加空行
      if (i > 0 && 
          lines[i].trim() && 
          lines[i - 1].trim() &&
          lines[i].length > 80 &&
          lines[i - 1].length > 80) {
        formattedLines.push("");
      }
    }
    
    return formattedLines.join("\n");
  }
  
  /**
   * 清理多余空白
   */
  static cleanExtraWhitespace(content) {
    return content
      .replace(/[ \t]+\n/g, "\n")    // 移除行尾空白
      .replace(/\n\s+\n/g, "\n\n")   // 标准化空行
      .trim();                        // 移除首尾空白
  }
}

// ============================================
// 内容安全检查
// ============================================

class ContentSafetyChecker {
  /**
   * 检查内容安全性
   */
  static checkSafety(content) {
    const issues = [];
    
    // 1. 检查内容长度
    if (content.length < 800) {
      issues.push("内容过短，建议至少1000字");
    }
    
    // 2. 检查章节完整性
    const sectionPattern = /^##\s+.+/gm;
    const sections = content.match(sectionPattern) || [];
    if (sections.length < 4) {
      issues.push(`章节不足，当前${sections.length}个，建议至少4个章节`);
    }
    
    // 3. 检查引用完整性
    const citationPattern = /\[.*?\]\(https?:\/\/[^\s)]+\)/g;
    const citations = content.match(citationPattern) || [];
    if (citations.length < 2) {
      issues.push(`引用不足，当前${citations.length}个，建议至少2个引用`);
    }
    
    // 4. 检查内容质量（简单启发式）
    const wordCount = content.length;
    const uniqueWords = new Set(content.toLowerCase().match(/\b\w+\b/g) || []);
    const uniqueRatio = uniqueWords.size / (wordCount / 5); // 粗略估计
    
    if (uniqueRatio < 0.3) {
      issues.push("内容重复词汇较多，建议增加词汇多样性");
    }
    
    // 5. 检查排版问题
    const longLinePattern = /^.{100,}$/gm;
    const longLines = content.match(longLinePattern) || [];
    if (longLines.length > 3) {
      issues.push(`有${longLines.length}行过长，建议每行不超过100字符`);
    }
    
    return {
      safe: issues.length === 0,
      issues,
      metrics: {
        wordCount,
        sections: sections.length,
        citations: citations.length,
        uniqueWords: uniqueWords.size,
        uniqueRatio: uniqueRatio.toFixed(2),
      }
    };
  }
  
  /**
   * 生成安全检查报告
   */
  static generateSafetyReport(content) {
    const safety = this.checkSafety(content);
    
    let report = "🔒 内容安全检查报告\n";
    report += "=".repeat(40) + "\n";
    
    report += `📊 内容指标:\n`;
    report += `   总字数: ${safety.metrics.wordCount}\n`;
    report += `   章节数: ${safety.metrics.sections}\n`;
    report += `   引用数: ${safety.metrics.citations}\n`;
    report += `   独特词汇: ${safety.metrics.uniqueWords}\n`;
    report += `   词汇多样性: ${safety.metrics.uniqueRatio}\n`;
    
    report += `\n⚠️ 安全问题:\n`;
    if (safety.issues.length === 0) {
      report += `   无安全问题 ✅\n`;
    } else {
      safety.issues.forEach(issue => {
        report += `   • ${issue}\n`;
      });
    }
    
    report += `\n🎯 建议:\n`;
    if (safety.issues.length > 0) {
      report += `   1. 请根据上述问题修改内容\n`;
      report += `   2. 确保内容质量达到标准\n`;
      report += `   3. 完成修改后重新检查\n`;
    } else {
      report += `   内容安全，可以准备发布 ✅\n`;
    }
    
    return {
      report,
      safe: safety.safe,
    };
  }
}

// ============================================
// 微信公众号发布管理器
// ============================================

class WeChatPublisher {
  constructor(config) {
    this.config = config;
    this.baseUrl = "https://api.weixin.qq.com/cgi-bin";
    this.accessToken = null;
    this.tokenExpiresAt = null;
  }
  
  /**
   * 模拟获取Access Token
   */
  async getAccessToken() {
    // 注意：这里是模拟实现
    // 实际实现需要调用微信API
    
    console.log("🔐 获取微信公众号Access Token...");
    
    // 模拟API调用
    const now = Date.now();
    
    if (this.accessToken && this.tokenExpiresAt > now) {
      console.log("   使用缓存的Access Token");
      return this.accessToken;
    }
    
    console.log("   调用微信API获取新Token");
    
    // 模拟Token
    this.accessToken = `mock_access_token_${now}`;
    this.tokenExpiresAt = now + (7200 * 1000); // 2小时
    
    console.log(`   Token获取成功，有效期至: ${new Date(this.tokenExpiresAt).toLocaleString()}`);
    
    return this.accessToken;
  }
  
  /**
   * 模拟上传素材
   */
  async uploadMedia(imageUrl, type = "image") {
    console.log(`📎 上传素材: ${type} ${imageUrl.substring(0, 50)}...`);
    
    // 模拟上传
    return {
      success: true,
      media_id: `mock_media_id_${Date.now()}`,
      url: imageUrl,
    };
  }
  
  /**
   * 模拟创建草稿（安全发布到草稿箱）
   */
  async createDraft(articles) {
    console.log("📝 创建微信公众号草稿...");
    
    const token = await this.getAccessToken();
    
    // 检查是否应该发布到草稿箱
    const publishToDraft = this.config.WECHAT_PUBLISH_TO_DRAFT === "true";
    
    if (publishToDraft) {
      console.log("   安全模式：发布到草稿箱");
    } else {
      console.log("   警告：直接发布到公众号");
      console.log("   建议：先使用草稿箱模式测试");
    }
    
    // 模拟草稿创建
    const drafts = [];
    
    for (const article of articles) {
      console.log(`   处理文章: ${article.title.substring(0, 30)}...`);
      
      // 安全检查
      const safetyReport = ContentSafetyChecker.generateSafetyReport(article.content);
      if (!safetyReport.safe) {
        console.warn(`   ⚠️ 文章未通过安全检查，跳过`);
        console.log(safetyReport.report);
        continue;
      }
      
      // 合理排版
      const formattedContent = WeChatFormatter.formatContent(article.content, {
        titleMaxLength: parseInt(this.config.WECHAT_FORMAT_TITLE_MAX) || 30,
        summaryMaxLength: parseInt(this.config.WECHAT_FORMAT_SUMMARY_MAX) || 150,
        requireSections: (this.config.WECHAT_FORMAT_REQUIRE_SECTIONS || "热点概述,技术分析,行业影响,未来展望,引用来源").split(","),
      });
      
      // 模拟草稿
      const draft = {
        article_id: `mock_article_${Date.now()}_${drafts.length}`,
        title: article.title,
        author: "AI助手",
        digest: article.summary,
        content: formattedContent,
        content_source_url: "",
        thumb_media_id: article.coverMediaId || "",
        need_open_comment: 0,
        only_fans_can_comment: 0,
        safety_passed: safetyReport.safe,
        safety_report: safetyReport.report,
        created_at: new Date().toISOString(),
        status: publishToDraft ? "draft" : "published",
      };
      
      drafts.push(draft);
      console.log(`   ✅ 文章准备完成: ${draft.article_id}`);
    }
    
    return {
      success: drafts.length > 0,
      message: publishToDraft ? "已发布到草稿箱" : "已直接发布",
      draft_count: drafts.length,
      drafts: drafts,
      next_step: "请在手机端微信公众号助手确认发布",
    };
  }
  
  /**
   * 安全发布文章
   */
  async safePublishArticles(articles) {
    console.log("=".repeat(60));
    console.log("🚀 开始微信公众号安全发布流程");
    console.log("=".repeat(60));
    
    // 1. 内容安全检查
    console.log("\n🔒 步骤1: 内容安全检查");
    for (const article of articles) {
      const safety = ContentSafetyChecker.generateSafetyReport(article.content);
      console.log(`   ${article.title.substring(0, 30)}... ${safety.safe ? "✅" : "❌"}`);
      
      if (!safety.safe) {
        console.log(safety.report);
      }
    }
    
    // 2. 合理排版
    console.log("\n🎨 步骤2: 内容合理排版");
    const formattedArticles = articles.map(article => ({
      ...article,
      content: WeChatFormatter.formatContent(article.content, {
        titleMaxLength: parseInt(this.config.WECHAT_FORMAT_TITLE_MAX) || 30,
        summaryMaxLength: parseInt(this.config.WECHAT_FORMAT_SUMMARY_MAX) || 150,
        requireSections: (this.config.WECHAT_FORMAT_REQUIRE_SECTIONS || "热点概述,技术分析,行业影响,未来展望,引用来源").split(","),
      })
    }));
    
    // 3. 创建草稿
    console.log("\n📝 步骤3: 创建微信公众号草稿");
    const result = await this.createDraft(formattedArticles);
    
    // 4. 生成发布报告
    console.log("\n📊 步骤4: 生成发布报告");
    const report = this.generatePublishReport(result);
    console.log(report);
    
    return result;
  }
  
  /**
   * 生成发布报告
   */
  generatePublishReport(result) {
    let report = "\n📋 微信公众号发布报告\n";
    report += "=".repeat(40) + "\n";
    
    report += `📅 发布时间: ${new Date().toLocaleString("zh-CN")}\n`;
    report += `📊 处理结果: ${result.success ? "成功" : "失败"}\n`;
    report += `📝 文章数量: ${result.draft_count}篇\n`;
    report += `📦 发布模式: ${result.message}\n`;
    
    if (result.drafts && result.drafts.length > 0) {
      report += `\n📄 文章列表:\n`;
      result.drafts.forEach((draft, index) => {
        report += `   ${index + 1}. ${draft.title}\n`;
        report += `      状态: ${draft.status === "draft" ? "草稿箱" : "已发布"}\n`;
        report += `      安全: ${draft.safety_passed ? "通过" : "未通过"}\n`;
        report += `      ID: ${draft.article_id}\n`;
      });
    }
    
    report += `\n🚨 重要提醒:\n`;
    if (this.config.WECHAT_PUBLISH_TO_DRAFT === "true") {
      report += `   1. 文章已保存到草稿箱\n`;
      report += `   2. 请在手机端微信公众号助手确认发布\n`;
      report += `   3. 发布前请仔细检查内容和排版\n`;
    } else {
      report += `   1. ⚠️ 文章已直接发布\n`;
      report += `   2. 请立即检查发布效果\n`;
      report += `   3. 如有问题请及时处理\n`;
    }
    
    report += `\n📞 技术支持:\n`;
    report += `   如有任何问题，请及时反馈\n`;
    
    return report;
  }
}

// ============================================
// 主函数
// ============================================

async function main() {
  try {
    console.log("=".repeat(60));
    console.log("🚀 微信公众号安全发布系统");
    console.log("=".repeat(60));
    
    // 1. 加载配置
    console.log("\n🔧 步骤1: 加载配置...");
    const config = WeChatConfig.loadConfig();
    
    // 2. 创建发布管理器
    console.log("\n🔧 步骤2: 初始化发布管理器...");
    const publisher = new WeChatPublisher(config);
    
    // 3. 模拟文章数据
    console.log("\n🔧 步骤3: 准备测试文章...");
    const testArticles = [
      {
        title: "OpenAI发布新一代语言模型，技术突破分析",
        summary: "深度分析OpenAI最新语言模型的技术突破和行业影响",
        content: `# OpenAI发布新一代语言模型，技术突破分析

## 热点概述
OpenAI最近发布了新一代语言模型，在多项基准测试中性能显著提升。

## 技术分析
新一代模型采用了改进的架构设计，训练数据规模扩大了50%，计算效率提升30%。

## 行业影响
这一突破将推动AI应用在各个行业的发展，特别是内容创作、代码生成和教育领域。

## 未来展望
随着技术不断进步，我们预计未来AI模型将更加智能和高效。

## 引用来源
1. [OpenAI官方博客](https://openai.com/blog) - 官方技术细节
2. [科技媒体分析](https://techcrunch.com) - 行业影响分析
3. [学术论文](https://arxiv.org) - 技术原理研究`,
        coverImage: "https://example.com/ai-tech.jpg"
      }
    ];
    
    // 4. 安全发布
    console.log("\n🚀 步骤4: 开始安全发布流程...");
    const result = await publisher.safePublishArticles(testArticles);
    
    console.log("\n" + "=".repeat(60));
    console.log("✅ 微信公众号安全发布系统测试完成");
    console.log("=".repeat(60));
    
    return result;
    
  } catch (error) {
    console.error("❌ 系统执行失败:", error.message);
    process.exit(1);
  }
}

// ============================================
// 导出
// ============================================

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error("❌ 任务执行失败:", error.message);
    process.exit(1);
  });
}

export {
  WeChatConfig,
  WeChatFormatter,
  ContentSafetyChecker,
  WeChatPublisher,
};