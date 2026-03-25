#!/usr/bin/env node
/**
 * OpenClaw 每日新闻更新脚本
 * 
 * 这个脚本由 OpenClaw 在每日定时任务中调用
 * 它生成任务报告但不执行实际搜索（搜索由 OpenClaw 完成）
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// ============================================
// 配置
// ============================================

const SITES_CONFIG = {
  ai: {
    name: "AI News",
    searchQueries: [
      "AI latest news 2026",
      "artificial intelligence breakthroughs today",
      "OpenAI Google Anthropic latest updates",
      "machine learning research news",
      "AI chip technology developments"
    ],
    author: "ai-agent"
  },
  apple: {
    name: "Apple Devices",
    searchQueries: [
      "Apple iPhone latest news 2026",
      "MacBook updates today",
      "Apple product announcements",
      "iOS macOS updates news",
      "Apple silicon technology"
    ],
    author: "apple-agent"
  },
  streaming: {
    name: "Streaming Services",
    searchQueries: [
      "Netflix latest news 2026",
      "Disney Plus updates today",
      "streaming service announcements",
      "HBO Max new releases",
      "4K streaming technology"
    ],
    author: "streaming-agent"
  },
  tesla: {
    name: "Tesla News",
    searchQueries: [
      "Tesla latest news 2026",
      "Elon Musk updates today",
      "electric vehicle technology news",
      "Tesla battery developments",
      "Autopilot software updates"
    ],
    author: "tesla-agent"
  },
  "vpn-usa": {
    name: "VPN Services",
    searchQueries: [
      "VPN latest news 2026",
      "online privacy updates today",
      "internet security news",
      "encryption technology",
      "cybersecurity developments"
    ],
    author: "vpn-agent"
  },
  web3: {
    name: "Web3 Technology",
    searchQueries: [
      "Web3 latest news 2026",
      "blockchain technology updates",
      "cryptocurrency news today",
      "DeFi platform developments",
      "NFT marketplace news"
    ],
    author: "web3-agent"
  },
  "site-a": {
    name: "SEO Technology",
    searchQueries: [
      "SEO latest news 2026",
      "Google algorithm updates today",
      "search engine optimization news",
      "digital marketing trends",
      "website analytics developments"
    ],
    author: "seo-agent"
  }
};

// ============================================
// 工具函数
// ============================================

function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
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

function runBuildCheck() {
  log("运行编译检查...");
  const result = execCommand("npm run build");
  
  if (!result.success) {
    log(`编译失败: ${result.error}`);
    return false;
  }
  
  log("编译检查通过");
  return true;
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

function generateTaskReport() {
  const today = new Date().toISOString().slice(0, 10);
  const report = {
    date: today,
    sites: {},
    searchQueries: [],
    expectedArticles: 35, // 7 sites × 5 articles
    nextSteps: []
  };
  
  // 生成搜索查询列表
  for (const [siteSlug, config] of Object.entries(SITES_CONFIG)) {
    report.sites[siteSlug] = {
      name: config.name,
      searchQueries: config.searchQueries.slice(0, 3), // 每个站点前3个查询
      expectedArticles: 5
    };
    
    // 添加搜索查询到总列表
    config.searchQueries.slice(0, 3).forEach(query => {
      report.searchQueries.push(`${config.name}: ${query}`);
    });
  }
  
  // 生成下一步指示
  report.nextSteps = [
    "1. 使用 OpenClaw 的 web_search 工具搜索每个查询",
    "2. 基于搜索结果创作原创总结文章（每个专栏5篇）",
    "3. 保存文章到对应站点的 posts 目录",
    "4. 运行编译检查: npm run build",
    "5. 提交更改: git add -A && git commit -m 'Daily update'",
    "6. 等待飞书确认后推送: git push origin main"
  ];
  
  return report;
}

// ============================================
// 主函数
// ============================================

async function main() {
  const args = process.argv.slice(2);
  const skipBuild = args.includes("--skip-build");
  
  const today = new Date().toISOString().slice(0, 10);
  
  log("========================================");
  log("OpenClaw 每日新闻更新任务");
  log(`日期: ${today}`);
  log("========================================");
  
  // 1. 生成任务报告
  log("\n📋 生成任务报告...");
  const report = generateTaskReport();
  
  console.log("\n🎯 任务概览:");
  console.log(`   日期: ${report.date}`);
  console.log(`   专栏数量: ${Object.keys(report.sites).length}`);
  console.log(`   预期文章: ${report.expectedArticles} 篇`);
  
  console.log("\n🔍 需要搜索的查询:");
  report.searchQueries.forEach((query, index) => {
    console.log(`   ${index + 1}. ${query}`);
  });
  
  console.log("\n📊 专栏详情:");
  for (const [siteSlug, siteInfo] of Object.entries(report.sites)) {
    console.log(`   ${siteInfo.name} (${siteSlug}):`);
    console.log(`     - 搜索查询: ${siteInfo.searchQueries.join(", ")}`);
    console.log(`     - 预期文章: ${siteInfo.expectedArticles} 篇`);
  }
  
  // 2. 检查Git状态
  log("\n📦 检查Git状态...");
  const gitStatus = getGitStatus();
  
  if (gitStatus.changed) {
    console.log("\n⚠️  Git仓库有未提交的更改:");
    gitStatus.files.slice(0, 10).forEach(file => {
      console.log(`   ${file}`);
    });
    if (gitStatus.files.length > 10) {
      console.log(`   还有 ${gitStatus.files.length - 10} 个文件未列出`);
    }
  } else {
    console.log("\n✅  Git仓库是干净的");
  }
  
  // 3. 生成下一步操作指南
  console.log("\n🚀 下一步操作:");
  report.nextSteps.forEach((step, index) => {
    console.log(`   ${step}`);
  });
  
  // 4. 生成Markdown格式的报告（用于飞书消息）
  const markdownReport = `# 📰 每日新闻更新任务报告

## 任务信息
- **日期**: ${report.date}
- **专栏数量**: ${Object.keys(report.sites).length}
- **预期文章**: ${report.expectedArticles} 篇
- **Git状态**: ${gitStatus.changed ? '有未提交更改' : '干净'}

## 搜索查询列表

${report.searchQueries.map((q, i) => `${i + 1}. ${q}`).join('\n')}

## 各专栏详情

${Object.entries(report.sites).map(([slug, info]) => `
### ${info.name} (${slug})
- 搜索查询: ${info.searchQueries.join(', ')}
- 预期文章: ${info.expectedArticles} 篇
`).join('\n')}

## 操作步骤

${report.nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

## Git状态
${gitStatus.changed ? `有 ${gitStatus.files.length} 个文件未提交` : '无未提交更改'}

---

**注意**: 所有文章必须基于搜索结果进行原创总结，不能直接复制。编译通过后才能提交，推送前需要飞书确认。`;

  // 保存报告到文件
  const reportDir = join(rootDir, "reports");
  if (!existsSync(reportDir)) {
    mkdirSync(reportDir, { recursive: true });
  }
  
  const reportFile = join(reportDir, `daily-report-${today}.md`);
  writeFileSync(reportFile, markdownReport, "utf-8");
  log(`任务报告已保存: ${reportFile}`);
  
  // 5. 输出报告摘要（用于OpenClaw输出）
  console.log("\n" + "=".repeat(50));
  console.log("📄 任务报告摘要:");
  console.log("=".repeat(50));
  console.log(markdownReport);
  console.log("=".repeat(50));
  
  log("\n✅ 任务报告生成完成");
  log("下一步: OpenClaw 将执行搜索并生成文章");
}

// 运行
main().catch(error => {
  log(`任务执行失败: ${error.message}`);
  process.exit(1);
});