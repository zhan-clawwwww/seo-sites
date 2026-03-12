#!/usr/bin/env node
/**
 * 索引节奏管理脚本
 * 
 * 功能：
 * 1. 自动计算应该放出的文章（基于时间）
 * 2. 更新 index-schedule.json 配置
 * 3. 支持手动指定要放出的文章
 * 
 * 使用方法：
 *   node scripts/update-index-schedule.mjs site-a
 *   node scripts/update-index-schedule.mjs site-a --manual post-1 post-2
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

function getSiteSchedule(siteSlug) {
  const schedulePath = join(rootDir, "sites", siteSlug, "index-schedule.json");
  try {
    const content = readFileSync(schedulePath, "utf-8");
    return JSON.parse(content);
  } catch (error) {
    console.error(`无法读取 ${schedulePath}:`, error.message);
    process.exit(1);
  }
}

function getAllPostSlugs(siteSlug) {
  const postsDir = join(rootDir, "sites", siteSlug, "posts");
  try {
    const files = readdirSync(postsDir);
    return files
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
  } catch (error) {
    console.error(`无法读取 ${postsDir}:`, error.message);
    return [];
  }
}

function calculateNextRelease(schedule, allPostSlugs) {
  const now = new Date();
  const launchDate = new Date(schedule.launchDate);
  
  if (now < launchDate) {
    return {
      nextReleaseDate: launchDate,
      postsToRelease: schedule.initialPosts,
      isInitial: true,
    };
  }

  // 计算已经放出的文章
  const hoursSinceLaunch = (now.getTime() - launchDate.getTime()) / (1000 * 60 * 60);
  const cyclesPassed = Math.floor(hoursSinceLaunch / schedule.releaseIntervalHours);
  const postsPerCycle = schedule.postsPerRelease.min;
  const totalPostsReleased = schedule.initialPosts.length + cyclesPassed * postsPerCycle;
  
  const released = [
    ...schedule.initialPosts,
    ...allPostSlugs
      .filter((slug) => !schedule.initialPosts.includes(slug))
      .slice(0, totalPostsReleased - schedule.initialPosts.length),
  ];

  // 计算下一批应该放出的文章
  const remaining = allPostSlugs.filter((slug) => !released.includes(slug));
  const nextBatchSize = Math.min(
    schedule.postsPerRelease.max,
    remaining.length
  );
  const nextPosts = remaining.slice(0, nextBatchSize);
  
  // 计算下一个释放时间
  const nextCycle = cyclesPassed + 1;
  const nextReleaseDate = new Date(
    launchDate.getTime() + nextCycle * schedule.releaseIntervalHours * 60 * 60 * 1000
  );

  return {
    nextReleaseDate,
    postsToRelease: nextPosts,
    isInitial: false,
    currentlyReleased: released,
  };
}

function updateSchedule(siteSlug, schedule, newRelease) {
  // 添加新的释放批次到 releaseSchedule
  if (!newRelease.isInitial && newRelease.postsToRelease.length > 0) {
    schedule.releaseSchedule.push({
      releaseDate: newRelease.nextReleaseDate.toISOString(),
      posts: newRelease.postsToRelease,
    });
    
    // 按日期排序
    schedule.releaseSchedule.sort((a, b) => 
      new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
    );
  }

  const schedulePath = join(rootDir, "sites", siteSlug, "index-schedule.json");
  writeFileSync(schedulePath, JSON.stringify(schedule, null, 2) + "\n", "utf-8");
  console.log(`✅ 已更新 ${schedulePath}`);
}

function main() {
  const args = process.argv.slice(2);
  const siteSlug = args[0];
  
  if (!siteSlug) {
    console.error("用法: node scripts/update-index-schedule.mjs <site-slug> [--manual <post-slug>...]");
    process.exit(1);
  }

  const isManual = args[1] === "--manual";
  const manualPosts = isManual ? args.slice(2) : [];

  const schedule = getSiteSchedule(siteSlug);
  const allPostSlugs = getAllPostSlugs(siteSlug);

  console.log(`\n📊 站点: ${siteSlug}`);
  console.log(`📝 总文章数: ${allPostSlugs.length}`);
  console.log(`📅 策略: ${schedule.strategy}`);
  console.log(`🚀 上线时间: ${schedule.launchDate}\n`);

  if (isManual && manualPosts.length > 0) {
    // 手动模式：直接添加指定的文章到下一个批次
    const now = new Date();
    const nextRelease = {
      nextReleaseDate: now,
      postsToRelease: manualPosts,
      isInitial: false,
    };
    
    console.log(`📌 手动模式：准备放出 ${manualPosts.length} 篇文章`);
    console.log(`   文章列表: ${manualPosts.join(", ")}\n`);
    
    updateSchedule(siteSlug, schedule, nextRelease);
    console.log(`\n✅ 完成！下次构建时将包含这些文章。`);
  } else {
    // 自动模式：计算下一个应该放出的批次
    const nextRelease = calculateNextRelease(schedule, allPostSlugs);
    
    if (nextRelease.isInitial) {
      console.log(`⏰ 还未到上线时间，首次上线将放出: ${schedule.initialPosts.join(", ")}`);
    } else {
      const now = new Date();
      if (now >= nextRelease.nextReleaseDate) {
        console.log(`⏰ 已到释放时间，准备放出下一批文章:`);
        console.log(`   文章列表: ${nextRelease.postsToRelease.join(", ")}`);
        console.log(`   释放时间: ${nextRelease.nextReleaseDate.toISOString()}\n`);
        
        updateSchedule(siteSlug, schedule, nextRelease);
        console.log(`\n✅ 完成！下次构建时将包含这些文章。`);
      } else {
        const hoursUntilRelease = (nextRelease.nextReleaseDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        console.log(`⏰ 下一批释放时间: ${nextRelease.nextReleaseDate.toISOString()}`);
        console.log(`   距离释放还有: ${Math.ceil(hoursUntilRelease)} 小时`);
        console.log(`   将放出的文章: ${nextRelease.postsToRelease.join(", ")}`);
        console.log(`\n💡 提示: 如需提前放出，使用手动模式:`);
        console.log(`   node scripts/update-index-schedule.mjs ${siteSlug} --manual ${nextRelease.postsToRelease.join(" ")}`);
      }
    }
  }

  // 显示当前已放出的文章
  const released = schedule.releaseSchedule
    .filter((r) => new Date(r.releaseDate) <= new Date())
    .flatMap((r) => r.posts);
  const allReleased = [...new Set([...schedule.initialPosts, ...released])];
  
  console.log(`\n📈 当前已放出文章 (${allReleased.length}/${allPostSlugs.length}):`);
  console.log(`   ${allReleased.join(", ")}`);
}

main();

