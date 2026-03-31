import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articles = [
  'sites/ai/posts/ai-2026-03-31-future-of-ai-in-scientific-discovery.md',
  'sites/apple/posts/apple-2026-03-31-ar-glasses-ecosystem-revolution.md',
  'sites/openclaw/posts/openclaw-2026-03-31-future-of-local-ai-assistants.md',
  'sites/site-a/posts/site-a-2026-03-31-seo-evolution-in-ai-era.md',
  'sites/streaming/posts/streaming-2026-03-31-future-of-interactive-streaming.md',
  'sites/tesla/posts/tesla-2026-03-31-energy-ecosystem-revolution.md',
  'sites/vpn-usa/posts/vpn-usa-2026-03-31-future-of-digital-privacy-in-ai-world.md',
  'sites/web3/posts/web3-2026-03-31-convergence-of-ai-and-web3.md'
];

async function fixDateField() {
  for (const articlePath of articles) {
    const filePath = path.join(__dirname, articlePath);
    
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${articlePath}`);
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 将 date: 改为 pubDate:
    const newContent = content.replace(/^date:\s*(\d{4}-\d{2}-\d{2})/m, 'pubDate: $1');
    
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Fixed date field in: ${articlePath}`);
    } else {
      console.log(`No change needed: ${articlePath}`);
    }
  }
  
  console.log('\nDone! All date fields have been changed to pubDate.');
}

fixDateField().catch(console.error);