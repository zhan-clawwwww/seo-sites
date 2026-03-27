// 分析DuckDuckGo响应内容
import https from 'https';
import fs from 'fs';

const query = 'artificial+intelligence+news';
const url = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`;

console.log('分析DuckDuckGo响应内容...\n');

const req = https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'text/html'
  }
}, (res) => {
  console.log(`状态码: ${res.statusCode} ${res.statusMessage}`);
  
  let data = '';
  res.on('data', chunk => data += chunk);
  
  res.on('end', () => {
    // 保存响应内容到文件以便分析
    fs.writeFileSync('duckduckgo-response.html', data, 'utf8');
    console.log(`响应已保存到 duckduckgo-response.html (${data.length} 字节)`);
    
    // 分析内容
    console.log('\n=== 内容分析 ===');
    
    // 检查是否包含常见的DuckDuckGo元素
    const checks = [
      { name: '<html>标签', regex: /<html/i, found: data.includes('<html') },
      { name: '<body>标签', regex: /<body/i, found: data.includes('<body') },
      { name: '搜索结果区域', regex: /result-link|search-result/i, found: /result-link|search-result/i.test(data) },
      { name: '搜索表单', regex: /search-form|search-box/i, found: /search-form|search-box/i.test(data) },
      { name: '重定向脚本', regex: /window\.location|meta.*refresh/i, found: /window\.location|meta.*refresh/i.test(data) },
      { name: '验证码', regex: /captcha|verify/i, found: /captcha|verify/i.test(data) },
      { name: 'Cloudflare', regex: /cloudflare/i, found: /cloudflare/i.test(data) },
      { name: '等待页面', regex: /please wait|loading/i, found: /please wait|loading/i.test(data) }
    ];
    
    checks.forEach(check => {
      console.log(`${check.found ? '✅' : '❌'} ${check.name}: ${check.found ? '找到' : '未找到'}`);
    });
    
    // 提取关键内容片段
    console.log('\n=== 关键内容片段 ===');
    
    // 提取标题
    const titleMatch = data.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch) {
      console.log(`标题: ${titleMatch[1]}`);
    }
    
    // 提取前5行内容
    const lines = data.split('\n').slice(0, 10);
    console.log('\n前10行内容:');
    lines.forEach((line, index) => {
      console.log(`${index + 1}: ${line.trim().substring(0, 100)}${line.length > 100 ? '...' : ''}`);
    });
    
    // 检查响应是否包含实际内容
    const hasActualContent = data.length > 5000 && data.includes('</body>');
    console.log(`\n包含实际内容: ${hasActualContent ? '✅ 是' : '❌ 否'}`);
    
    console.log('\n=== 结论 ===');
    if (res.statusCode === 202) {
      console.log('DuckDuckGo返回状态码202，这可能意味着:');
      console.log('1. 请求被接受但需要额外处理');
      console.log('2. 需要JavaScript渲染');
      console.log('3. 可能是反爬虫机制');
      console.log('4. 可能需要等待或使用不同参数');
    }
    
    if (/cloudflare|captcha/i.test(data)) {
      console.log('\n⚠️ 检测到Cloudflare或验证码保护！');
      console.log('DuckDuckGo可能在使用反爬虫保护。');
      console.log('可能需要:');
      console.log('1. 使用不同的User-Agent');
      console.log('2. 添加延迟和随机化');
      console.log('3. 使用官方API替代');
    }
  });
});

req.on('error', (error) => {
  console.error(`请求错误: ${error.message}`);
});

req.end();