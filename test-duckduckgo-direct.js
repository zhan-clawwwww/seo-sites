// 直接测试DuckDuckGo API
import https from 'https';

console.log('=== 直接测试DuckDuckGo API ===\n');

const testQueries = [
  'artificial+intelligence+news',
  'apple+news+today',
  'technology+news+2026'
];

function testDuckDuckGo(query) {
  return new Promise((resolve, reject) => {
    const url = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`;
    
    console.log(`测试查询: ${query}`);
    console.log(`URL: ${url}`);
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 15000,
      followRedirects: true,
      maxRedirects: 5
    };
    
    const req = https.get(url, options, (res) => {
      console.log(`状态码: ${res.statusCode}`);
      console.log(`状态消息: ${res.statusMessage}`);
      console.log(`响应头:`);
      console.log(`  Content-Type: ${res.headers['content-type']}`);
      console.log(`  Content-Length: ${res.headers['content-length'] || '未知'}`);
      console.log(`  Location: ${res.headers['location'] || '无重定向'}`);
      
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log(`响应大小: ${data.length} 字节`);
        console.log(`响应前100字符: ${data.substring(0, 100).replace(/\n/g, ' ')}...`);
        
        // 检查是否是有效HTML
        const isHtml = data.includes('<html') || data.includes('<!DOCTYPE');
        console.log(`是HTML页面: ${isHtml}`);
        
        // 检查是否有搜索结果
        const hasResults = data.includes('result-link') || data.includes('search-result');
        console.log(`包含搜索结果: ${hasResults}`);
        
        resolve({
          statusCode: res.statusCode,
          isHtml,
          hasResults,
          size: data.length
        });
      });
    });
    
    req.on('error', (error) => {
      console.log(`请求错误: ${error.code || error.message}`);
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      console.log('请求超时');
      reject(new Error('请求超时'));
    });
  });
}

async function runTests() {
  console.log('开始测试...\n');
  
  for (const query of testQueries) {
    try {
      console.log(`\n--- 测试: "${query}" ---`);
      const result = await testDuckDuckGo(query);
      
      if (result.statusCode === 200 && result.isHtml && result.hasResults) {
        console.log('✅ DuckDuckGo工作正常！');
      } else if (result.statusCode === 202) {
        console.log('⚠️ DuckDuckGo返回状态码202 (Accepted)');
        console.log('这可能意味着请求被接受但需要特殊处理');
      } else {
        console.log(`❌ 可能有问题: 状态码=${result.statusCode}, HTML=${result.isHtml}, 结果=${result.hasResults}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒
      
    } catch (error) {
      console.log(`❌ 测试失败: ${error.message}`);
    }
  }
  
  console.log('\n=== 测试完成 ===');
}

runTests().catch(console.error);