/**
 * IndexNow 快速收录脚本
 *
 * IndexNow 是 Bing/Yandex/Seznam 支持的即时索引协议，Google 也在测试阶段支持。
 * 上线后或发布新文章后运行此脚本，可让搜索引擎立即发现新内容。
 *
 * 使用方法：
 *   node scripts/submit-indexnow.mjs --site vpn-usa
 *   node scripts/submit-indexnow.mjs --site site-a
 *   node scripts/submit-indexnow.mjs --all-sites   # 与 CI 一致的各频道 + Ping 全站 sitemap
 *
 * 前提：
 *   1. 在网站根目录放置验证文件 /public/<YOUR_API_KEY>.txt，内容为 API Key 本身
 *   2. 填写下方 INDEXNOW_KEY（在 https://www.bing.com/indexnow 申请）
 *   3. 部署后再运行
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

// ── 配置区 ──────────────────────────────────────────────────
// 在 IndexNow 官网申请 key，或直接生成一个 UUID
const INDEXNOW_KEY = "by687dm0txw1ovfinrpkhg2z5q3jeasu";

// 站点配置（从 config.json 读取）
function loadSiteConfig(siteSlug) {
  const configPath = join(rootDir, "sites", siteSlug, "config.json");
  return JSON.parse(readFileSync(configPath, "utf-8"));
}

// 读取所有文章 slug
function getPostSlugs(siteSlug) {
  const postsDir = join(rootDir, "sites", siteSlug, "posts");
  const files = readdirSync(postsDir);
  return files
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

async function submitToIndexNow(siteSlug) {
  if (INDEXNOW_KEY === "REPLACE_WITH_YOUR_INDEXNOW_KEY") {
    console.error("❌ 请先在脚本中填写 INDEXNOW_KEY！");
    process.exit(1);
  }

  const config = loadSiteConfig(siteSlug);
  const baseUrl = config.baseUrl.replace(/\/$/, "");

  const postsDir = join(rootDir, "sites", siteSlug, "posts");
  const slugs = readdirSync(postsDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));

  const urls = [
    `${baseUrl}/${siteSlug}/`,
    `${baseUrl}/${siteSlug}/posts/`,
    `${baseUrl}/${siteSlug}/ai-frontiers/`,
    `${baseUrl}/${siteSlug}/privacy-security/`,
    `${baseUrl}/${siteSlug}/about/`,
    `${baseUrl}/${siteSlug}/contact/`,
    ...slugs.map((s) => `${baseUrl}/${siteSlug}/posts/${s}/`),
  ];

  console.log(`📋 准备提交 ${urls.length} 个 URL...`);

  const payload = {
    host: new URL(baseUrl).hostname,
    key: INDEXNOW_KEY,
    keyLocation: `${baseUrl}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  // IndexNow API（Bing 端点，与多个搜索引擎共享）
  const endpoint = "https://api.indexnow.org/indexnow";

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });

    if (res.ok || res.status === 202) {
      console.log(`✅ IndexNow 提交成功！状态码: ${res.status}`);
      console.log(`   已提交 ${urls.length} 个 URL 到 Bing/Yandex 等搜索引擎`);
    } else {
      const text = await res.text();
      console.error(`❌ 提交失败，状态码: ${res.status}`);
      console.error("响应:", text);
    }
  } catch (err) {
    console.error("❌ 网络错误:", err.message);
  }

  // 同时 Ping Google Search Console Sitemap
  const sitemapUrl = encodeURIComponent(`${baseUrl}/${siteSlug}/sitemap.xml`);
  const googlePingUrl = `https://www.google.com/ping?sitemap=${sitemapUrl}`;

  try {
    const gRes = await fetch(googlePingUrl);
    if (gRes.ok) {
      console.log(`✅ Google Sitemap Ping 成功！`);
    }
  } catch {
    console.log(`⚠️  Google Sitemap Ping 失败（可忽略，改用 GSC 手动提交）`);
  }
}

// Ping Google Sitemap（sitemap_index 或单站点 sitemap）
async function pingGoogleSitemap(sitemapUrl) {
  const url = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      console.log(`✅ Google Sitemap Ping 成功: ${sitemapUrl}`);
    }
  } catch {
    console.log(`⚠️  Google Sitemap Ping 失败（可改用 GSC 手动提交）`);
  }
}

/** 与仓库 sites/*/config.json 一致（全量频道） */
function getAllSiteSlugs() {
  const sitesDir = join(rootDir, "sites");
  return readdirSync(sitesDir)
    .filter((name) => existsSync(join(sitesDir, name, "config.json")))
    .sort((a, b) => a.localeCompare(b));
}

const PRODUCTION_SITE_SLUGS = getAllSiteSlugs();

async function submitAllProductionSites() {
  const rootBaseUrl = process.env.PUBLIC_ROOT_BASE_URL || "https://wordok.top";
  const sitemapIndex = `${rootBaseUrl.replace(/\/$/, "")}/sitemap_index.xml`;

  console.log(`\n🚀 IndexNow：依次提交 ${PRODUCTION_SITE_SLUGS.length} 个频道\n`);

  for (const slug of PRODUCTION_SITE_SLUGS) {
    const cfgPath = join(rootDir, "sites", slug, "config.json");
    if (!existsSync(cfgPath)) {
      console.warn(`⚠️  跳过（无 config）: ${slug}`);
      continue;
    }
    console.log(`\n── 频道: ${slug} ──`);
    await submitToIndexNow(slug);
    await new Promise((r) => setTimeout(r, 800));
  }

  console.log(`\n🚀 Ping 全站 Sitemap Index\n`);
  await pingGoogleSitemap(sitemapIndex);
}

// ── 主程序 ──────────────────────────────────────────────────
const args = process.argv.slice(2);
const siteIdx = args.indexOf("--site");
const useAll = args.includes("--all");
const useAllSites = args.includes("--all-sites");
const siteSlug = siteIdx >= 0 ? args[siteIdx + 1] : null;

if (useAllSites) {
  submitAllProductionSites().catch((e) => {
    console.error(e);
    process.exit(1);
  });
} else if (useAll) {
  const rootBaseUrl = process.env.PUBLIC_ROOT_BASE_URL || "https://wordok.top";
  const sitemapIndex = `${rootBaseUrl.replace(/\/$/, "")}/sitemap_index.xml`;
  console.log(`\n🚀 提交全站 Sitemap Index 到 Google\n`);
  pingGoogleSitemap(sitemapIndex);
} else if (siteSlug) {
  console.log(`\n🚀 IndexNow 提交工具 - 站点: ${siteSlug}\n`);
  submitToIndexNow(siteSlug);
} else {
  console.error("用法:");
  console.error("  node scripts/submit-indexnow.mjs --site <site-slug>  # 单站点 IndexNow + Google Ping");
  console.error("  node scripts/submit-indexnow.mjs --all              # 仅 Ping Google Sitemap Index");
  console.error("  node scripts/submit-indexnow.mjs --all-sites        # 各启用频道 IndexNow + Ping sitemap index");
  process.exit(1);
}
