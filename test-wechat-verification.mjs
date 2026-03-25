#!/usr/bin/env node
/**
 * 微信验证文件测试脚本
 * 检查验证文件是否正确配置和可访问
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname);

// 验证文件信息
const VERIFICATION_FILE = "by687dm0txw1ovfinrpkhg2z5q3jeasu.txt";
const EXPECTED_CONTENT = "by687dm0txw1ovfinrpkhg2z5q3jeasu";

console.log("🔍 微信验证文件配置检查");
console.log("=" .repeat(50));

// 检查点1: 源文件是否存在
const sourcePath = join(rootDir, "public", VERIFICATION_FILE);
console.log(`\n1. 检查源文件: ${sourcePath}`);

if (existsSync(sourcePath)) {
  const content = readFileSync(sourcePath, "utf-8").trim();
  if (content === EXPECTED_CONTENT) {
    console.log("   ✅ 源文件存在且内容正确");
    console.log(`     内容: "${content}"`);
  } else {
    console.log("   ❌ 源文件内容不正确");
    console.log(`     预期: "${EXPECTED_CONTENT}"`);
    console.log(`     实际: "${content}"`);
  }
} else {
  console.log("   ❌ 源文件不存在");
}

// 检查点2: 构建输出文件是否存在
const distPath = join(rootDir, "dist", VERIFICATION_FILE);
console.log(`\n2. 检查构建文件: ${distPath}`);

if (existsSync(distPath)) {
  const content = readFileSync(distPath, "utf-8").trim();
  if (content === EXPECTED_CONTENT) {
    console.log("   ✅ 构建文件存在且内容正确");
    console.log(`     内容: "${content}"`);
  } else {
    console.log("   ❌ 构建文件内容不正确");
    console.log(`     预期: "${EXPECTED_CONTENT}"`);
    console.log(`     实际: "${content}"`);
  }
} else {
  console.log("   ❌ 构建文件不存在（需要先运行 npm run build）");
}

// 检查点3: 网站访问信息
console.log(`\n3. 网站访问信息:`);
console.log(`   域名: wordok.top`);
console.log(`   验证URL: https://wordok.top/${VERIFICATION_FILE}`);
console.log(`   预期响应: ${EXPECTED_CONTENT}`);

// 检查点4: Git状态
console.log(`\n4. Git版本控制:`);
const publicInGit = existsSync(join(rootDir, ".git", "objects"));
if (publicInGit) {
  console.log("   ✅ 项目在Git版本控制中");
} else {
  console.log("   ⚠️  项目未在Git版本控制中");
}

// 总结
console.log("\n" + "=" .repeat(50));
console.log("📋 验证总结");

const tests = [
  { name: "源文件存在", path: sourcePath },
  { name: "构建文件存在", path: distPath },
];

let passed = 0;
tests.forEach(test => {
  if (existsSync(test.path)) {
    console.log(`   ✅ ${test.name}`);
    passed++;
  } else {
    console.log(`   ❌ ${test.name}`);
  }
});

console.log(`\n🎯 通过率: ${passed}/${tests.length}`);

if (passed === tests.length) {
  console.log("\n✅ 微信验证文件配置正确！");
  console.log("   微信平台应能成功验证域名所有权。");
} else {
  console.log("\n⚠️  需要修复配置问题");
  console.log("   请确保文件正确放置在 public/ 目录并运行构建。");
}

console.log("\n💡 操作建议:");
console.log("   1. 访问 https://wordok.top/by687dm0txw1ovfinrpkhg2z5q3jeasu.txt 确认可访问");
console.log("   2. 在微信平台提交此URL进行验证");
console.log("   3. 保持文件不变，不要删除或修改");