import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fixAllDateFields() {
  // 获取所有文章
  const postsDir = path.join(__dirname, 'sites');
  const allFiles = [];
  
  function collectFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        collectFiles(fullPath);
      } else if (entry.name.endsWith('.md')) {
        allFiles.push(fullPath);
      }
    }
  }
  
  collectFiles(postsDir);
  
  console.log(`Found ${allFiles.length} markdown files`);
  
  let fixedCount = 0;
  
  for (const filePath of allFiles) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否有 date: 字段但没有 pubDate:
    if (content.includes('date:') && !content.includes('pubDate:')) {
      // 将 date: 改为 pubDate:
      const newContent = content.replace(/^date:\s*(\d{4}-\d{2}-\d{2})/m, 'pubDate: $1');
      
      if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        const relativePath = path.relative(__dirname, filePath);
        console.log(`Fixed: ${relativePath}`);
        fixedCount++;
      }
    }
  }
  
  console.log(`\nDone! Fixed ${fixedCount} files.`);
}

fixAllDateFields().catch(console.error);