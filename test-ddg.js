const https = require('https');
const url = 'https://lite.duckduckgo.com/lite/?q=artificial+intelligence+news+today';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Length:', data.length);
    
    const hasResults = data.includes('result-link');
    console.log('Has results:', hasResults);
    
    if (hasResults) {
      const linkRegex = /class="result-link"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
      let match;
      let count = 0;
      while ((match = linkRegex.exec(data)) !== null && count < 5) {
        console.log('Found:', match[2].trim(), '->', match[1]);
        count++;
      }
    } else {
      console.log('No results found');
      // 检查是否被重定向或被阻止
      if (data.includes('captcha')) {
        console.log('Captcha detected');
      } else if (data.includes('blocked')) {
        console.log('Blocked by DuckDuckGo');
      } else {
        console.log('Unknown page structure, first 1000 chars:');
        console.log(data.substring(0, 1000));
      }
    }
  });
}).on('error', (e) => {
  console.error('Error:', e.message);
});
