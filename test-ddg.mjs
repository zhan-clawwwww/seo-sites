import https from 'https';

const url = 'https://lite.duckduckgo.com/lite/?q=artificial+intelligence+news+today';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Length:', data.length);
    
    const hasResults = data.includes('result-link');
    console.log('Has result-link class:', hasResults);
    
    // Try different patterns
    const patterns = [
      { name: 'result-link', regex: /class="result-link"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g },
      { name: 'result__a', regex: /class="result__a"[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/g },
      { name: 'any <a> with href', regex: /<a[^>]+href="(https?:\/\/[^"]+)"[^>]*>([^<]{10,})<\/a>/g }
    ];
    
    for (const p of patterns) {
      let match;
      let count = 0;
      while ((match = p.regex.exec(data)) !== null && count < 3) {
        console.log(`[${p.name}] ${match[2].trim().slice(0, 80)} -> ${match[1].slice(0, 80)}`);
        count++;
      }
      if (count > 0) console.log(`[${p.name}] Total found: ${count}+`);
    }
    
    // Check for common blocking patterns
    if (data.includes('captcha')) console.log('WARNING: Captcha detected');
    if (data.includes('blocked')) console.log('WARNING: Blocked');
    if (data.includes('rate limit')) console.log('WARNING: Rate limited');
  });
}).on('error', (e) => {
  console.error('Error:', e.message);
});
