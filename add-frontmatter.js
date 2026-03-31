import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articles = [
  {
    file: 'sites/apple/posts/apple-2026-03-31-ar-glasses-ecosystem-revolution.md',
    title: "Apple's AR Glasses Ecosystem Revolution: Transforming How We See and Interact with the World",
    category: "Apple Devices",
    tags: ["Apple", "AR Glasses", "Augmented Reality", "Vision Pro", "Ecosystem"],
    excerpt: "Following the groundbreaking success of Vision Pro, Apple is poised to revolutionize augmented reality with its upcoming AR glasses ecosystem. Set for a late 2026 or early 2027 release, these lightweight, stylish glasses aim to make augmented reality an all-day, everyday experience."
  },
  {
    file: 'sites/openclaw/posts/openclaw-2026-03-31-future-of-local-ai-assistants.md',
    title: "The Future of Local AI Assistants: Privacy, Personalization, and Planetary-Scale Processing",
    category: "Open Source AI",
    tags: ["OpenClaw", "AI Assistants", "Privacy", "Local AI", "Personalization"],
    excerpt: "As concerns about data privacy, cloud dependency, and AI centralization grow, a new paradigm is emerging: local AI assistants that run entirely on personal devices without sending data to external servers."
  },
  {
    file: 'sites/site-a/posts/site-a-2026-03-31-seo-evolution-in-ai-era.md',
    title: "The Evolution of SEO in the AI Era: From Keywords to Contextual Understanding",
    category: "SEO & Web Development",
    tags: ["SEO", "Search Engine Optimization", "AI", "Content Strategy", "Digital Marketing"],
    excerpt: "Search Engine Optimization is undergoing its most significant transformation since the advent of Google's RankBrain in 2015. In 2026, AI is not just a tool for SEO professionals but the fundamental architecture of search itself."
  },
  {
    file: 'sites/streaming/posts/streaming-2026-03-31-future-of-interactive-streaming.md',
    title: "The Future of Interactive Streaming: From Passive Viewing to Participatory Entertainment",
    category: "Streaming Entertainment",
    tags: ["Streaming", "Interactive", "Entertainment", "Platforms", "Content"],
    excerpt: "The streaming industry is undergoing a fundamental transformation from passive content consumption to interactive, participatory experiences. In 2026, platforms are no longer just libraries of movies and shows but dynamic ecosystems."
  },
  {
    file: 'sites/tesla/posts/tesla-2026-03-31-energy-ecosystem-revolution.md',
    title: "Tesla's Energy Ecosystem Revolution: Beyond Electric Vehicles to a Comprehensive Sustainable Energy Platform",
    category: "Electric Vehicles",
    tags: ["Tesla", "Electric Vehicles", "Energy", "Sustainability", "Innovation"],
    excerpt: "While Tesla remains synonymous with electric vehicles, the company's most transformative impact may ultimately come from its expanding energy ecosystem. In 2026, Tesla is evolving from an automotive manufacturer to a comprehensive sustainable energy platform."
  },
  {
    file: 'sites/vpn-usa/posts/vpn-usa-2026-03-31-future-of-digital-privacy-in-ai-world.md',
    title: "The Future of Digital Privacy in an AI-Driven World: Beyond VPNs to Comprehensive Privacy Ecosystems",
    category: "Digital Privacy",
    tags: ["VPN", "Privacy", "Security", "Encryption", "Data Protection"],
    excerpt: "As artificial intelligence becomes increasingly integrated into every aspect of digital life, traditional privacy tools like VPNs are proving insufficient for protecting personal information in 2026."
  },
  {
    file: 'sites/web3/posts/web3-2026-03-31-convergence-of-ai-and-web3.md',
    title: "The Convergence of AI and Web3: Creating Decentralized Intelligent Systems",
    category: "Web3 & Blockchain",
    tags: ["Web3", "Blockchain", "AI", "Decentralization", "Cryptocurrency"],
    excerpt: "The intersection of artificial intelligence and Web3 technologies is creating fundamentally new paradigms for decentralized, intelligent systems. In 2026, we're witnessing the emergence of AI-native blockchain architectures."
  }
];

async function addFrontmatter() {
  for (const article of articles) {
    const filePath = path.join(__dirname, article.file);
    
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${article.file}`);
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 检查是否已经有frontmatter
    if (content.startsWith('---\n')) {
      console.log(`Already has frontmatter: ${article.file}`);
      continue;
    }
    
    // 创建frontmatter
    const frontmatter = `---
title: "${article.title}"
date: 2026-03-31
author: "SEO Content Team"
category: "${article.category}"
tags: ${JSON.stringify(article.tags)}
excerpt: "${article.excerpt}"
---

`;
    
    // 合并内容
    const newContent = frontmatter + content;
    
    // 保存文件
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Added frontmatter to: ${article.file}`);
  }
  
  console.log('\nDone! All articles have frontmatter.');
}

addFrontmatter().catch(console.error);