#!/usr/bin/env node
/**
 * 每日新闻采集脚本 (支持自动网络搜索)
 *
 * 功能：
 * 1. 搜索苹果设备最新新闻
 * 2. 搜索AI最新新闻
 * 3. 生成新的文章文件到对应站点
 * 4. Git提交并推送
 *
 * 使用方法：
 *   node scripts/daily-news-update.mjs
 *   node scripts/daily-news-update.mjs --skip-search  # 跳过搜索，仅提交现有更改
 *   node scripts/daily-news-update.mjs --dry-run     # 测试模式，不写入文件
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

const CONFIG = {
  apple: {
    siteSlug: "apple",
    postsDir: join(rootDir, "sites", "apple", "posts")
  },
  ai: {
    siteSlug: "ai",
    postsDir: join(rootDir, "sites", "ai", "posts")
  },
  git: {
    authorName: "Matrix Agent",
    authorEmail: "agent@matrix.ai"
  },
  news: {
    appleKeywords: ["Apple device 2026", "iPhone news 2026", "MacBook news 2026", "Apple product launch"],
    aiKeywords: ["AI news 2026", "artificial intelligence breakthrough", "OpenAI Google Anthropic news", "LLM latest"],
    maxNewsPerCategory: 3
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

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 60);
}

function generateFilename(title, prefix = "") {
  const date = new Date().toISOString().slice(0, 10);
  const slug = slugify(title);
  return `${prefix}${date}-${slug}.md`.substring(0, 80);
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
      timeout: 60000
    });
    return { success: true, output };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// Git操作
// ============================================

function gitCommit(message) {
  execCommand(`git config user.name "${CONFIG.git.authorName}"`);
  execCommand(`git config user.email "${CONFIG.git.authorEmail}"`);

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
// 文章操作
// ============================================

function getExistingSlugs(siteSlug) {
  const postsDir = join(rootDir, "sites", siteSlug, "posts");
  if (!existsSync(postsDir)) return [];
  return readdirSync(postsDir)
    .filter(f => f.endsWith(".md"))
    .map(f => f.replace(/\.md$/, ""));
}

function saveArticle(siteSlug, filename, content, dryRun = false) {
  if (dryRun) {
    log(`[DRY RUN] 会保存: ${filename}`, "info");
    return true;
  }

  const postsDir = join(rootDir, "sites", siteSlug, "posts");
  if (!existsSync(postsDir)) {
    mkdirSync(postsDir, { recursive: true });
  }

  const filepath = join(postsDir, filename);
  writeFileSync(filepath, content, "utf-8");
  log(`已保存: ${filename}`, "success");
  return filepath;
}

// ============================================
// 新闻搜索和采集
// ============================================

async function searchNews(query) {
  log(`搜索: "${query}"`);
  // 注意：这里需要调用外部搜索API
  // 在Node.js环境中，可以:
  // 1. 使用curl调用搜索API
  // 2. 使用Puppeteer/Playwright抓取新闻网站
  // 3. 接入news API服务

  // 示例：返回空数组，实际使用时接入API
  log(`  (需要接入搜索API才能获取: "${query}")`, "warning");
  return [];
}

async function fetchAppleNews() {
  const news = [];
  for (const keyword of CONFIG.news.appleKeywords) {
    const results = await searchNews(keyword);
    news.push(...results);
    if (news.length >= CONFIG.news.maxNewsPerCategory) break;
  }
  return news.slice(0, CONFIG.news.maxNewsPerCategory);
}

async function fetchAINews() {
  const news = [];
  for (const keyword of CONFIG.news.aiKeywords) {
    const results = await searchNews(keyword);
    news.push(...results);
    if (news.length >= CONFIG.news.maxNewsPerCategory) break;
  }
  return news.slice(0, CONFIG.news.maxNewsPerCategory);
}

// ============================================
// 主流程
// ============================================

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const skipSearch = args.includes("--skip-search");

  log("========================================");
  log("🚀 开始每日新闻更新任务");
  if (dryRun) log("⚠️  DRY RUN 模式 - 不会写入文件");
  log("========================================");

  const today = formatDate();
  const newArticles = [];
  const updatedFiles = [];

  // ============================================
  // 1. 搜索苹果设备新闻
  // ============================================
  if (!skipSearch) {
    log("\n📱 搜索苹果设备最新新闻...");

    try {
      const existingAppleSlugs = getExistingSlugs(CONFIG.apple.siteSlug);
      const appleNews = await fetchAppleNews();

      for (const news of appleNews) {
        const filename = generateFilename(news.title, "apple-");
        const slug = filename.replace(".md", "");

        if (existingAppleSlugs.includes(slug)) {
          log(`跳过已存在: ${news.title.substring(0, 40)}...`, "warning");
          continue;
        }

        const frontmatter = {
          title: news.title,
          description: news.description,
          keywords: news.keywords || ["Apple", "tech news"],
          pubDate: today,
          author: "news-agent"
        };

        const content = news.content || news.description || "";
        const markdown = generateMarkdown(frontmatter, content);

        const result = saveArticle(CONFIG.apple.siteSlug, filename, markdown, dryRun);
        if (result) {
          newArticles.push({ site: "apple", title: news.title, filename });
          updatedFiles.push(join(CONFIG.apple.postsDir, filename));
        }
      }

      log(`苹果新闻: ${appleNews.length} 篇处理完成`, "success");
    } catch (error) {
      log(`苹果新闻采集出错: ${error.message}`, "error");
    }
  }

  // ============================================
  // 2. 搜索AI新闻
  // ============================================
  if (!skipSearch) {
    log("\n🤖 搜索AI最新新闻...");

    try {
      const existingAISlugs = getExistingSlugs(CONFIG.ai.siteSlug);
      const aiNews = await fetchAINews();

      for (const news of aiNews) {
        const filename = generateFilename(news.title, "ai-");
        const slug = filename.replace(".md", "");

        if (existingAISlugs.includes(slug)) {
          log(`跳过已存在: ${news.title.substring(0, 40)}...`, "warning");
          continue;
        }

        const frontmatter = {
          title: news.title,
          description: news.description,
          keywords: news.keywords || ["AI", "artificial intelligence"],
          pubDate: today,
          author: "news-agent",
          topic: "ai-frontiers"
        };

        const content = news.content || news.description || "";
        const markdown = generateMarkdown(frontmatter, content);

        const result = saveArticle(CONFIG.ai.siteSlug, filename, markdown, dryRun);
        if (result) {
          newArticles.push({ site: "ai", title: news.title, filename });
          updatedFiles.push(join(CONFIG.ai.postsDir, filename));
        }
      }

      log(`AI新闻: ${aiNews.length} 篇处理完成`, "success");
    } catch (error) {
      log(`AI新闻采集出错: ${error.message}`, "error");
    }
  }

  // ============================================
  // 3. 更新sitemap (静态站点sitemap自动生成)
  // ============================================
  log("\n🗺️  Sitemap说明:");
  log("  本项目使用Astro静态生成，sitemap会在build时自动生成");
  log("  运行 'npm run build' 会自动更新所有sitemap");

  // ============================================
  // 4. Git提交并推送
  // ============================================
  log("\n========================================");
  log("📊 任务执行完成");
  log(`日期: ${today}`);
  log(`新增文章: ${newArticles.length} 篇`);
  log("========================================");

  if (newArticles.length > 0) {
    log("\n新增文章列表:");
    for (const article of newArticles) {
      log(`  - [${article.site}] ${article.title.substring(0, 50)}...`);
    }

    if (!dryRun) {
      log("\n📦 开始Git操作...");

      // 获取git远程信息
      const remoteResult = execCommand("git remote get-url origin");
      const remoteUrl = remoteResult.success ? remoteResult.output.trim() : "origin";

      const commitMessage = `Daily update: Add ${newArticles.length} news articles (${today})`;

      if (gitCommit(commitMessage)) {
        if (gitPush()) {
          log("\n🎉 全部完成！新闻已更新并推送到GitHub。", "success");
        } else {
          log("\n⚠️ Git推送失败，请检查网络或凭据。", "warning");
        }
      }
    } else {
      log("\n⚠️ DRY RUN模式，跳过Git操作", "warning");
    }
  } else {
    log("\n没有新增文章，跳过Git提交。", "info");

    if (!skipSearch && !dryRun) {
      // 即使没有新文章，也检查是否有其他更改需要提交
      const statusResult = execCommand("git status --porcelain");
      if (statusResult.output?.trim()) {
        log("\n发现其他更改，询问是否提交...");
        // 可以选择提交其他更改
      }
    }
  }

  log("\n💡 提示:");
  log("  - 要跳过搜索直接处理现有文件: --skip-search");
  log("  - 测试模式（不写入文件）: --dry-run");
  log("  - 要接入真实新闻源，请修改脚本中的 searchNews 函数");

  return newArticles;
}

// 运行
main().catch(error => {
  log(`任务执行失败: ${error.message}`, "error");
  process.exit(1);
});
