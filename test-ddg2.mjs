import https from 'https';

const url = 'https://lite.duckduckgo.com/lite/?q=artificial+intelligence+news+today';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Length:', data.length);
    
    // Save full HTML for inspection
    import('fs').then(fs => {
      fs.writeFileSync('ddg-response.html', data, 'utf8');
      console.log('Saved to ddg-response.html');
    });
    
    // Print a section that might contain results
    const bodyStart = data.indexOf('<body');
    if (bodyStart > -1) {
      console.log('\n=== Body content (first 3000 chars) ===');
      console.log(data.substring(bodyStart, bodyStart + 3000));
    }
  });
}).on('error', (e) => {
  console.error('Error:', e.message);
});
