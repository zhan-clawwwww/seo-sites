#!/usr/bin/env node
/**
 * SEO网站每日内容生成任务
 * 基于 DuckDuckGo 搜索最新新闻生成英文文章
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_PATH = path.resolve(__dirname);

// 频道配置 - 每个频道的搜索词
const CHANNELS = [
  { id: 'ai', query: 'artificial+intelligence+news+March+2026' },
  { id: 'apple', query: 'Apple+iPhone+news+March+2026' },
  { id: 'openclaw', query: 'open+source+AI+tools+local+deployment+2026' },
  { id: 'site-a', query: 'Google+search+SEO+news+March+2026' },
  { id: 'streaming', query: 'Netflix+Disney+streaming+news+March+2026' },
  { id: 'tesla', query: 'Tesla+news+March+2026' },
  { id: 'vpn-usa', query: 'cybersecurity+VPN+news+March+2026' },
  { id: 'web3', query: 'cryptocurrency+bitcoin+news+March+2026' }
];

// 使用 DuckDuckGo Lite 搜索
function searchDuckDuckGo(query) {
  return new Promise((resolve, reject) => {
    const url = `https://lite.duckduckgo.com/lite/?q=${query}`;
    
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const results = parseResults(data);
        resolve(results);
      });
    }).on('error', reject);
  });
}

// 解析搜索结果
function parseResults(html) {
  const results = [];
  const regex = /<a rel="nofollow" class="result-link" href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
  const snippetRegex = /<td class="result-snippet">([^<]*)<\/td>/g;
  
  let match;
  const links = [];
  const snippets = [];
  
  while ((match = regex.exec(html)) !== null) {
    links.push({ url: match[1], title: match[2].trim() });
  }
  
  while ((match = snippetRegex.exec(html)) !== null) {
    snippets.push(match[1].trim());
  }
  
  for (let i = 0; i < Math.min(links.length, 10); i++) {
    results.push({
      title: links[i].title,
      url: links[i].url,
      snippet: snippets[i] || ''
    });
  }
  
  return results;
}

// 生成文章
function generateArticle(channelId, searchResults) {
  const topic = searchResults[0]?.title || `${channelId} News`;
  const slug = `${channelId}-${new Date().toISOString().split('T')[0]}-${topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}`;
  
  let content = `# ${topic}\n\n`;
  
  // 从搜索结果生成内容
  const relevantResults = searchResults.filter(r => r.snippet.length > 50).slice(0, 4);
  
  if (relevantResults.length > 0) {
    // 引言
    content += `${relevantResults[0].snippet}\n\n`;
    
    // 各段落
    relevantResults.forEach((result, i) => {
      if (i > 0) {
        content += `## ${result.title.split(':')[0].split(' - ')[0]}\n\n`;
        content += `${result.snippet}\n\n`;
      }
    });
  } else {
    content += `Recent developments in ${channelId} continue to evolve as the industry progresses.\n\n`;
    content += `Stay tuned for more updates.\n\n`;
  }
  
  // 来源
  if (searchResults.length > 0) {
    content += `## Sources\n\n`;
    searchResults.slice(0, 5).forEach((r, i) => {
      content += `${i + 1}. [${r.title}](${r.url})\n`;
    });
    content += '\n';
  }
  
  content += `---\n\n*Published on wordok.top — ${new Date().toISOString().split('T')[0]}*\n`;
  
  return { title: topic.slice(0, 80), slug, content };
}

// 保存文章
function saveArticle(channelId, article) {
  const postsDir = path.join(PROJECT_PATH, 'sites', channelId, 'posts');
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }
  
  const filepath = path.join(postsDir, `${article.slug}.md`);
  if (fs.existsSync(filepath)) {
    console.log(`  Skipped (exists): ${article.slug}`);
    return null;
  }
  
  const frontmatter = `---
title: "${article.title}"
description: "Latest news and developments."
keywords: ${JSON.stringify(article.title.toLowerCase().split(' ').slice(0, 5))}
pubDate: "${new Date().toISOString().split('T')[0]}"
author: "wordok"
---

${article.content}`;

  fs.writeFileSync(filepath, frontmatter, 'utf8');
  return filepath;
}

// 主函数
async function main() {
  console.log('='.repeat(60));
  console.log('SEO SITES DAILY CONTENT GENERATION');
  console.log('Date:', new Date().toISOString().split('T')[0]);
  console.log('='.repeat(60));
  
  const generatedFiles = [];
  
  for (const channel of CHANNELS) {
    console.log(`\n[${channel.id.toUpperCase()}] Searching: ${channel.query}`);
    
    try {
      const results = await searchDuckDuckGo(channel.query);
      console.log(`  Found ${results.length} results`);
      
      if (results.length > 0) {
        const article = generateArticle(channel.id, results);
        const filepath = saveArticle(channel.id, article);
        if (filepath) {
          generatedFiles.push(filepath);
          console.log(`  Generated: ${article.slug}`);
        }
      }
    } catch (error) {
      console.error(`  Error: ${error.message}`);
    }
    
    await new Promise(r => setTimeout(r, 1000)); // 延迟避免被封
  }
  
  // 提交
  if (generatedFiles.length > 0) {
    console.log('\nCommitting changes...');
    try {
      execSync('git add -A', { stdio: 'inherit', cwd: PROJECT_PATH });
      execSync(`git commit -m "content: auto-generated ${new Date().toISOString().split('T')[0]} - ${generatedFiles.length} articles"`, { stdio: 'inherit', cwd: PROJECT_PATH });
      console.log('Committed. Run "git push" to upload.');
    } catch (e) {
      console.log('No changes to commit.');
    }
  }
  
  console.log('\nDone! Generated', generatedFiles.length, 'articles.');
}

main().catch(console.error);
