// 测试网络连接状态
import https from 'https';

console.log('=== 网络连接测试 ===\n');

const testUrls = [
  { name: 'DuckDuckGo Lite', url: 'https://lite.duckduckgo.com/lite/?q=test' },
  { name: 'Google', url: 'https://www.google.com' },
  { name: 'NewsAPI (示例)', url: 'https://newsapi.org/v2/top-headlines?country=us&apiKey=demo' },
  { name: 'GitHub', url: 'https://github.com' }
];

function testConnection(name, url) {
  return new Promise((resolve) => {
    console.log(`测试连接: ${name} (${url})`);
    
    const req = https.get(url, { timeout: 10000 }, (res) => {
      console.log(`✅ ${name}: 连接成功 (状态码: ${res.statusCode})`);
      resolve(true);
    });
    
    req.on('error', (error) => {
      console.log(`❌ ${name}: 连接失败 - ${error.code || error.message}`);
      resolve(false);
    });
    
    req.on('timeout', () => {
      req.destroy();
      console.log(`❌ ${name}: 连接超时`);
      resolve(false);
    });
  });
}

async function runTests() {
  const results = [];
  
  for (const test of testUrls) {
    const success = await testConnection(test.name, test.url);
    results.push({ name: test.name, success });
    await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒
  }
  
  console.log('\n=== 测试结果汇总 ===');
  results.forEach(result => {
    console.log(`${result.success ? '✅' : '❌'} ${result.name}: ${result.success ? '可用' : '不可用'}`);
  });
  
  const availableCount = results.filter(r => r.success).length;
  console.log(`\n可用连接: ${availableCount}/${results.length}`);
  
  if (availableCount === 0) {
    console.log('\n⚠️ 严重: 所有网络连接都失败！');
    console.log('可能原因:');
    console.log('1. 网络完全断开');
    console.log('2. 防火墙/代理设置问题');
    console.log('3. DNS解析问题');
    console.log('4. 系统时间不正确');
  } else if (availableCount < results.length) {
    console.log(`\n⚠️ 部分连接失败: ${results.length - availableCount} 个`);
    console.log('对SEO任务的影响:');
    console.log('1. DuckDuckGo失败 → 触发降级策略');
    console.log('2. 降级策略需要配置API key才能工作');
    console.log('3. 最终会使用主题库备用内容');
  } else {
    console.log('\n✅ 所有连接正常！');
  }
}

runTests().catch(console.error);