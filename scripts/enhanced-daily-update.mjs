#!/usr/bin/env node
/**
 * 增强版每日网站运营脚本
 * 
 * 新要求：
 * 1. 每个专栏每天3篇文章
 * 2. 基于网络检索的最新消息
 * 3. 分析和合并总结原创文章
 * 4. 文章篇幅完整，不能太短
 * 5. 结尾处标明引用原文地址
 * 6. 适当引用图片和视频
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// ============================================
// 增强配置
// ============================================

const ENHANCED_SITES_CONFIG = {
  ai: {
    name: "AI News",
    searchQueries: [
      "AI technology breakthroughs 2026 latest news",
      "machine learning research advancements today",
      "OpenAI Google Anthropic AI updates"
    ],
    author: "ai-researcher",
    articleRequirements: {
      minLength: 1200,
      sections: ["技术突破", "行业影响", "未来趋势", "引用来源"],
      includeMedia: true,
      citationStyle: "学术引用"
    }
  },
  apple: {
    name: "Apple Devices",
    searchQueries: [
      "Apple iPhone latest features and reviews 2026",
      "MacBook technology updates today",
      "Apple silicon and software advancements"
    ],
    author: "apple-analyst",
    articleRequirements: {
      minLength: 1100,
      sections: ["产品特性", "性能评测", "用户反馈", "引用来源"],
      includeMedia: true,
      citationStyle: "产品评测"
    }
  },
  streaming: {
    name: "Streaming Services",
    searchQueries: [
      "Netflix Disney Plus streaming content updates 2026",
      "streaming technology and platform features",
      "content licensing and original productions"
    ],
    author: "streaming-critic",
    articleRequirements: {
      minLength: 1000,
      sections: ["内容更新", "技术特性", "用户体验", "引用来源"],
      includeMedia: true,
      citationStyle: "娱乐报道"
    }
  },
  tesla: {
    name: "Tesla News",
    searchQueries: [
      "Tesla electric vehicle technology updates 2026",
      "Elon Musk Tesla company developments",
      "EV battery and charging advancements"
    ],
    author: "ev-expert",
    articleRequirements: {
      minLength: 1300,
      sections: ["技术更新", "市场动态", "行业分析", "引用来源"],
      includeMedia: true,
      citationStyle: "科技报道"
    }
  },
  "vpn-usa": {
    name: "VPN Services",
    searchQueries: [
      "VPN security and privacy technology 2026",
      "online privacy protection latest solutions",
      "internet security tools and services"
    ],
    author: "security-analyst",
    articleRequirements: {
      minLength: 1050,
      sections: ["安全特性", "性能测试", "使用建议", "引用来源"],
      includeMedia: true,
      citationStyle: "安全指南"
    }
  },
  web3: {
    name: "Web3 Technology",
    searchQueries: [
      "blockchain technology developments 2026",
      "cryptocurrency and DeFi updates",
      "decentralized applications and platforms"
    ],
    author: "blockchain-expert",
    articleRequirements: {
      minLength: 1150,
      sections: ["技术进展", "应用场景", "风险评估", "引用来源"],
      includeMedia: true,
      citationStyle: "技术分析"
    }
  },
  "site-a": {
    name: "SEO Technology",
    searchQueries: [
      "SEO and digital marketing trends 2026",
      "search engine optimization techniques",
      "website analytics and performance"
    ],
    author: "seo-specialist",
    articleRequirements: {
      minLength: 1000,
      sections: ["策略分析", "实施方法", "效果评估", "引用来源"],
      includeMedia: true,
      citationStyle: "专业指南"
    }
  }
};

// ============================================
// 文章模板
// ============================================

const ARTICLE_TEMPLATES = {
  analysis: {
    title: "【深度分析】{topic}的最新发展与趋势",
    structure: [
      "## 1. 核心内容概述",
      "## 2. 关键技术突破",
      "## 3. 行业影响分析", 
      "## 4. 未来发展趋势",
      "## 5. 总结与建议",
      "## 引用来源"
    ]
  },
  review: {
    title: "【综合评测】{topic}的全面分析与评价",
    structure: [
      "## 1. 产品/服务介绍",
      "## 2. 主要特性分析",
      "## 3. 性能表现评测",
      "## 4. 优缺点总结",
      "## 5. 购买/使用建议",
      "## 引用来源"
    ]
  },
  guide: {
    title: "【实用指南】关于{topic}的完整操作手册",
    structure: [
      "## 1. 基础概念介绍",
      "## 2. 操作步骤详解",
      "## 3. 常见问题解答",
      "## 4. 最佳实践建议",
      "## 5. 进阶技巧分享",
      "## 引用来源"
    ]
  }
};

// ============================================
// 工具函数
// ============================================

function log(message, type = "info") {
  const timestamp = new Date().toISOString();
  const icons = { info: "ℹ️", success: "✅", warning: "⚠️", error: "❌" };
  console.log(`${icons[type]} [${timestamp}] ${message}`);
}

function execCommand(command, cwd = rootDir) {
  try {
    const output = execSync(command, {
      cwd,
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 60000
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function getGitStatus() {
  const statusResult = execCommand("git status --porcelain");
  if (!statusResult.success) {
    return { changed: false, files: [] };
  }
  
  const files = statusResult.output
    .split('\n')
    .filter(line => line.trim())
    .map(line => line.trim());
    
  return { changed: files.length > 0, files };
}

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
// 增强任务报告生成
// ============================================

function generateEnhancedTaskReport() {
  const today = new Date().toISOString().slice(0, 10);
  const report = {
    date: today,
    sites: {},
    searchQueries: [],
    expectedArticles: 0,
    qualityRequirements: {},
    nextSteps: []
  };
  
  // 生成每个专栏的配置
  for (const [siteSlug, config] of Object.entries(ENHANCED_SITES_CONFIG)) {
    report.sites[siteSlug] = {
      name: config.name,
      searchQueries: config.searchQueries,
      expectedArticles: 3, // 每个专栏3篇文章
      author: config.author,
      requirements: config.articleRequirements
    };
    
    report.expectedArticles += 3;
    
    // 添加搜索查询
    config.searchQueries.forEach(query => {
      report.searchQueries.push({
        site: config.name,
        query: query,
        purpose: "深度分析文章素材"
      });
    });
  }
  
  // 质量要求
  report.qualityRequirements = {
    minArticleLength: 1000,
    requiredSections: ["内容分析", "技术细节", "行业影响", "引用来源"],
    citationRequired: true,
    mediaInclusion: "推荐",
    originality: "基于多源信息的原创总结"
  };
  
  // 详细的下一步操作
  report.nextSteps = [
    "1. 使用 web_search 工具搜索每个查询的最新信息",
    "2. 基于搜索结果进行深度分析和合并总结",
    "3. 创作每篇至少1000字的原创文章",
    "4. 文章必须包含：内容分析、技术细节、行业影响等章节",
    "5. 在文章结尾处准确标明所有引用来源的URL",
    "6. 适当添加相关的图片和视频引用（如适用）",
    "7. 保存文章到对应站点的 posts 目录",
    "8. 运行编译检查: npm run build",
    "9. 提交更改: git add -A && git commit -m 'Daily update'",
    "10. 等待飞书确认后推送: git push origin main"
  ];
  
  return report;
}

// ============================================
// 文章生成指南
// ============================================

function generateArticleGuidelines() {
  return `
# 📝 文章创作指南

## 核心要求
1. **数量**: 每个专栏每天3篇原创文章
2. **质量**: 每篇至少1000字，内容充实有深度
3. **原创性**: 基于多源信息的分析和总结，不直接复制

## 文章结构模板

### 模板A：深度分析型
\`\`\`
【深度分析】主题的最新发展与趋势

## 1. 核心内容概述
- 简要介绍主题背景
- 概括主要发展动态

## 2. 关键技术突破
- 分析具体技术进展
- 对比新旧技术差异

## 3. 行业影响分析  
- 对相关行业的影响
- 市场反应和趋势

## 4. 未来发展趋势
- 预测未来发展
- 潜在机会和挑战

## 5. 总结与建议
- 综合总结分析
- 实用建议和展望

## 引用来源
1. [来源1标题](URL1) - 主要观点摘要
2. [来源2标题](URL2) - 补充信息说明
3. [来源3标题](URL3) - 数据支持来源
\`\`\`

### 模板B：综合评测型
\`\`\`
【综合评测】产品/服务的全面分析

## 1. 产品/服务介绍
- 基本功能和特性
- 目标用户和市场定位

## 2. 主要特性分析
- 详细功能解析
- 技术实现方式

## 3. 性能表现评测
- 实际测试结果
- 优缺点对比分析

## 4. 优缺点总结
- 明确列出优点
- 客观指出不足

## 5. 购买/使用建议
- 适用场景推荐
- 使用技巧分享

## 引用来源
[包括评测视频、官方文档、用户评价等链接]
\`\`\`

## 引用规范
1. **必须标明所有引用来源的完整URL**
2. **每个引用简要说明引用的具体内容**
3. **优先引用权威和最新的信息来源**
4. **适当添加图片和视频引用（如适用）**

## 质量检查清单
✅ 文章长度达到1000字以上  
✅ 结构清晰，逻辑连贯  
✅ 基于多源信息原创总结  
✅ 引用来源完整准确  
✅ 适当包含媒体内容  
✅ 语言流畅，专业准确
`;
}

// ============================================
// 主函数
// ============================================

async function main() {
  const args = process.argv.slice(2);
  const skipBuild = args.includes("--skip-build");
  
  const today = new Date().toISOString().slice(0, 10);
  
  log("========================================");
  log("🚀 增强版每日网站运营任务");
  log(`日期: ${today}`);
  log("模式: 高质量原创文章创作");
  log("========================================");
  
  // 1. 生成增强版任务报告
  log("\n📋 生成增强版任务报告...");
  const report = generateEnhancedTaskReport();
  
  console.log("\n🎯 任务概览:");
  console.log(`   日期: ${report.date}`);
  console.log(`   专栏数量: ${Object.keys(report.sites).length}`);
  console.log(`   预期文章: ${report.expectedArticles} 篇`);
  console.log(`   质量要求: 每篇≥${report.qualityRequirements.minArticleLength}字`);
  
  console.log("\n🔍 需要搜索的深度查询:");
  report.searchQueries.forEach((item, index) => {
    console.log(`   ${index + 1}. ${item.site}: ${item.query}`);
    console.log(`      目的: ${item.purpose}`);
  });
  
  console.log("\n📊 专栏详情与要求:");
  for (const [siteSlug, siteInfo] of Object.entries(report.sites)) {
    console.log(`\n   ${siteInfo.name} (${siteSlug}):`);
    console.log(`     作者: ${siteInfo.author}`);
    console.log(`     文章数: ${siteInfo.expectedArticles} 篇/天`);
    console.log(`     最低字数: ${siteInfo.requirements.minLength}`);
    console.log(`     必须章节: ${siteInfo.requirements.sections.join(", ")}`);
    console.log(`     引用要求: ${siteInfo.requirements.citationStyle}`);
    console.log(`     媒体内容: ${siteInfo.requirements.includeMedia ? "推荐添加" : "可选"}`);
    console.log(`     搜索查询:`);
    siteInfo.searchQueries.forEach((query, i) => {
      console.log(`       ${i + 1}. ${query}`);
    });
  }
  
  console.log("\n📝 质量要求:");
  console.log(`   原创性: ${report.qualityRequirements.originality}`);
  console.log(`   引用要求: ${report.qualityRequirements.citationRequired ? "必须" : "可选"}`);
  console.log(`   媒体内容: ${report.qualityRequirements.mediaInclusion}`);
  report.qualityRequirements.requiredSections.forEach((section, i) => {
    console.log(`   章节${i + 1}: ${section}`);
  });
  
  // 2. 生成文章创作指南
  console.log("\n" + "=".repeat(50));
  console.log(generateArticleGuidelines());
  console.log("=".repeat(50));
  
  // 3. 检查Git状态
  log("\n📦 检查Git状态...");
  const gitStatus = getGitStatus();
  
  if (gitStatus.changed) {
    console.log("\n⚠️  Git仓库有未提交的更改:");
    gitStatus.files.slice(0, 5).forEach(file => {
      console.log(`   ${file}`);
    });
    if (gitStatus.files.length > 5) {
      console.log(`   还有 ${gitStatus.files.length - 5} 个文件未列出`);
    }
  } else {
    console.log("\n✅  Git仓库是干净的");
  }
  
  // 4. 生成下一步操作指南
  console.log("\n🚀 详细操作步骤:");
  report.nextSteps.forEach((step, index) => {
    console.log(`   ${step}`);
  });
  
  // 5. 生成Markdown格式的报告（用于飞书消息）
  const markdownReport = `# 📰 增强版每日网站运营任务报告

## 任务信息
- **日期**: ${report.date}
- **专栏数量**: ${Object.keys(report.sites).length}
- **预期文章**: ${report.expectedArticles} 篇
- **质量要求**: 每篇至少${report.qualityRequirements.minArticleLength}字
- **Git状态**: ${gitStatus.changed ? '有未提交更改' : '干净'}

## 各专栏详情

${Object.entries(report.sites).map(([slug, info]) => `
### ${info.name} (${slug})
- **文章数量**: 3篇/天
- **作者**: ${info.author}
- **最低字数**: ${info.requirements.minLength}
- **必须章节**: ${info.requirements.sections.join('、')}
- **引用风格**: ${info.requirements.citationStyle}
- **媒体内容**: ${info.requirements.includeMedia ? '推荐添加' : '可选'}

**搜索查询**:
${info.searchQueries.map((q, i) => `${i + 1}. ${q}`).join('\n')}
`).join('\n')}

## 质量要求
- **原创性**: 基于多源信息的分析和总结
- **引用要求**: 必须标明所有引用来源URL
- **文章结构**: 必须包含指定章节
- **媒体内容**: 适当添加图片和视频引用

## 操作步骤

${report.nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

---

**重要提示**: 所有文章必须是基于搜索结果的原创总结，不能直接复制。编译通过后才能提交，推送前需要飞书确认。`;

  // 保存报告到文件
  const reportDir = join(rootDir, "reports");
  if (!existsSync(reportDir)) {
    mkdirSync(reportDir, { recursive: true });
  }
  
  const reportFile = join(reportDir, `enhanced-daily-report-${today}.md`);
  writeFileSync(reportFile, markdownReport, "utf-8");
  log(`增强版任务报告已保存: ${reportFile}`);
  
  // 6. 输出报告摘要
  console.log("\n" + "=".repeat(50));
  console.log("📄 任务报告摘要:");
  console.log("=".repeat(50));
  console.log(markdownReport);
  console.log("=".repeat(50));
  
  log("\n✅ 增强版任务报告生成完成");
  log("下一步: 执行搜索并创作高质量原创文章");
  
  // 7. 编译检查（可选）
  if (!skipBuild) {
    console.log("\n🔧 运行编译检查...");
    const buildSuccess = runBuildCheck();
    
    if (!buildSuccess) {
      log("编译失败，请在创作文章前修复问题", "error");
      return;
    }
  }
}

// 运行主函数
main().catch(error => {
  log(`任务执行失败: ${error.message}`, "error");
  process.exit(1);
});