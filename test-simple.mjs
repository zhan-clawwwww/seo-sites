#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TODAY = new Date().toISOString().split('T')[0];

console.log('✅ 简化脚本运行成功');
console.log('   项目路径:', __dirname);
console.log('   今天日期:', TODAY);
console.log('   测试完成');

// 创建测试文件
const testDir = path.join(__dirname, 'test-output');
if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
}

const testFile = path.join(testDir, 'test-' + TODAY + '.txt');
fs.writeFileSync(testFile, 'SEO 测试文件 - ' + TODAY);

console.log('   测试文件已创建:', testFile);
