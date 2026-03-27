#!/usr/bin/env node
/**
 * SEO网站每日内容生成任务
 * 周一到周六上午9:30执行
 * 要求：
 * 1. 所有文章英文
 * 2. 直接面向用户，不要SEO/配图建议等
 * 3. 不删除任何已有文章
 * 4. 生成前总结每个专栏最近10篇文章
 * 5. 推送前通知用户确认
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_PATH = path.resolve(__dirname);

const CHANNELS = [
  { id: 'ai', topics: ['Artificial General Intelligence', 'Machine Learning Breakthroughs', 'Large Language Models', 'AI Ethics and Safety', 'Computer Vision Advances', 'AI in Healthcare', 'Robotics and Automation'] },
  { id: 'apple', topics: ['iPhone Development', 'Mac Innovation', 'iOS Updates', 'Apple Silicon', 'Apple Ecosystem', 'WWDC Announcements', 'App Store Changes'] },
  { id: 'openclaw', topics: ['AI Assistant Development', 'Open Source AI Tools', 'Workflow Automation', 'Developer Productivity', 'Local AI Deployment', 'Agent Frameworks', 'AI Gateway Setup'] },
  { id: 'site-a', topics: ['Web Performance Optimization', 'Technical SEO Guide', 'Content Strategy', 'Site Architecture', 'Core Web Vitals', 'JavaScript SEO', 'Server-Side Rendering'] },
  { id: 'streaming', topics: ['Streaming Technology', 'Content Delivery Networks', 'Video Compression', 'Live Streaming Platforms', 'OTT Services', 'Adaptive Bitrate', 'Streaming Hardware'] },
  { id: 'tesla', topics: ['Electric Vehicle Technology', 'Autonomous Driving Systems', 'Battery Innovation', 'EV Market Trends', 'Sustainable Transportation', 'Tesla Software Updates', 'EV Charging Infrastructure'] },
  { id: 'vpn-usa', topics: ['Network Security', 'Privacy Protection', 'Encryption Technologies', 'Secure Communications', 'Cybersecurity Trends', 'Zero Trust Architecture', 'Remote Work Security'] },
  { id: 'web3', topics: ['Blockchain Fundamentals', 'Decentralized Finance', 'Smart Contract Development', 'Web3 Infrastructure', 'Digital Assets', 'Layer 2 Solutions', 'Web3 Wallets'] }
];

class SEODailyTask {
  constructor() {
    this.currentDate = new Date().toISOString().split('T')[0];
    this.articlesGenerated = 0;
    this.generatedFiles = [];
    this.channelSummary = {};
  }

  // Git同步
  async gitSync() {
    console.log('🔄 Syncing with Git repository...');
    try {
      execSync('git pull', { stdio: 'inherit', cwd: PROJECT_PATH });
      console.log('✅ Git sync complete\n');
    } catch (error) {
      console.log('⚠️ Git sync skipped (no remote or network issue)\n');
    }
  }

  // 获取每个频道最近10篇文章
  getRecentArticles(channelId) {
    const postsDir = path.join(PROJECT_PATH, 'sites', channelId, 'posts');
    if (!fs.existsSync(postsDir)) {
      return [];
    }

    const files = fs.readdirSync(postsDir)
      .filter(f => f.endsWith('.md'))
      .sort()
      .reverse()
      .slice(0, 10);

    const articles = [];
    for (const file of files) {
      const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
      const titleMatch = content.match(/title:\s*["'](.+?)["']/);
      if (titleMatch) {
        articles.push({
          filename: file,
          title: titleMatch[1]
        });
      }
    }
    return articles;
  }

  // 生成主题摘要
  generateTopicSummary(channelId, recentArticles) {
    console.log(`\n📊 [${channelId.toUpperCase()}] Recent Articles (last 10):`);
    if (recentArticles.length === 0) {
      console.log('   No existing articles');
    } else {
      recentArticles.forEach((article, index) => {
        console.log(`   ${index + 1}. ${article.title}`);
      });
    }
    console.log('');
  }

  // 选择新主题（避免重复）
  selectNewTopic(channel, recentArticles) {
    const recentTitles = recentArticles.map(a => a.title.toLowerCase());
    
    // 找到还没有写过的主题
    for (const topic of channel.topics) {
      const topicLower = topic.toLowerCase();
      const isUsed = recentTitles.some(title => 
        title.includes(topicLower) || topicLower.includes(title.split(' ').slice(0, 2).join(' ').toLowerCase())
      );
      if (!isUsed) {
        return topic;
      }
    }
    
    // 如果所有主题都用过了，返回第一个
    return channel.topics[0];
  }

  // 生成文章内容
  generateArticleContent(channel, topic) {
    const contentMap = {
      'Artificial General Intelligence': {
        intro: 'Artificial General Intelligence (AGI) represents systems that can understand, learn, and apply knowledge across any domain, similar to human cognition.',
        sections: [
          { title: 'What Makes AGI Different', content: 'Unlike narrow AI designed for specific tasks, AGI would handle novel situations it was not explicitly programmed for. Current systems excel in defined domains but struggle with unfamiliar scenarios.' },
          { title: 'Current Research Approaches', content: 'Researchers explore neuromorphic computing, meta-learning, and foundation models. These approaches aim to create more flexible learning systems that can generalize across tasks.' },
          { title: 'Key Technical Challenges', content: 'Major obstacles include sample efficiency, common sense reasoning, and transfer learning. Current deep learning requires massive datasets while humans learn from few examples.' },
          { title: 'Practical Implications', content: 'AGI would transform industries from healthcare to scientific research. However, development requires careful attention to safety and alignment considerations.' }
        ]
      },
      'Machine Learning Breakthroughs': {
        intro: 'Machine learning continues to evolve rapidly with new architectures and training methods expanding what automated systems can accomplish.',
        sections: [
          { title: 'Recent Architectural Advances', content: 'State-space models like Mamba offer efficient alternatives to transformers for long sequences. Sparse mixture-of-experts architectures enable larger models without proportional compute increases.' },
          { title: 'Training Efficiency Improvements', content: 'Techniques like LoRA enable fine-tuning large models on consumer hardware. Self-supervised learning reduces dependence on labeled data.' },
          { title: 'Emerging Applications', content: 'Protein structure prediction advances drug discovery. Code generation produces production-ready software. Scientific discovery identifies patterns humans might miss.' },
          { title: 'Infrastructure Evolution', content: 'Model compression enables edge deployment. Distributed training frameworks support larger models. MLOps practices mature for reliable production systems.' }
        ]
      },
      'Large Language Models': {
        intro: 'Large Language Models have transformed AI interaction with remarkable capabilities in understanding and generating human-like text.',
        sections: [
          { title: 'Architecture Overview', content: 'Modern LLMs use transformer architectures with self-attention. Training involves pre-training on text corpora followed by instruction tuning and reinforcement learning.' },
          { title: 'Current Capabilities', content: 'LLMs excel at summarization, translation, code generation, and reasoning. However, they can hallucinate facts and struggle with precise calculations.' },
          { title: 'Deployment Options', content: 'Quantization and distillation enable consumer hardware deployment. API-based deployment offers scalability. Local deployment provides privacy and offline capability.' },
          { title: 'Future Directions', content: 'Research focuses on improved reasoning and factual accuracy. Tool use and agentic capabilities expand what LLMs can accomplish.' }
        ]
      },
      'AI Ethics and Safety': {
        intro: 'As AI systems become more powerful, ensuring they operate safely and ethically becomes increasingly critical.',
        sections: [
          { title: 'Alignment Challenges', content: 'Ensuring AI systems pursue intended goals requires careful design. Reward hacking and Goodhart effects can lead to unintended behaviors.' },
          { title: 'Bias and Fairness', content: 'Training data biases can perpetuate discrimination. Techniques include data auditing, debiasing algorithms, and diverse development teams.' },
          { title: 'Transparency and Explainability', content: 'Understanding AI decisions is essential for trust. Interpretability methods help identify how systems reach conclusions.' },
          { title: 'Governance Frameworks', content: 'Organizations develop guidelines for responsible AI. These cover risk assessment, testing requirements, and ongoing monitoring.' }
        ]
      },
      'iPhone Development': {
        intro: 'iOS development continues to evolve with new frameworks, capabilities, and best practices for building mobile applications.',
        sections: [
          { title: 'SwiftUI Evolution', content: 'SwiftUI matures as Apple primary UI framework. New modifiers and components simplify interface creation while maintaining platform conventions.' },
          { title: 'App Architecture Patterns', content: 'Modern iOS apps use Combine for reactive programming, Swift Concurrency for async operations, and clear separation of concerns.' },
          { title: 'Performance Optimization', content: 'Instruments helps identify bottlenecks. Efficient memory management, background task handling, and network optimization improve user experience.' },
          { title: 'App Store Considerations', content: 'Understanding review guidelines, privacy requirements, and subscription models helps developers navigate the ecosystem successfully.' }
        ]
      },
      'Mac Innovation': {
        intro: 'Mac computers lead in performance and efficiency with Apple Silicon and continuous platform improvements.',
        sections: [
          { title: 'Apple Silicon Progress', content: 'M-series chips deliver exceptional performance per watt. Unified memory architecture enables efficient data sharing between CPU and GPU.' },
          { title: 'macOS Features', content: 'Continuity features connect Mac with other Apple devices. Stage Manager and improved window management enhance productivity.' },
          { title: 'Development Tools', content: 'Xcode provides comprehensive development environment. Instruments, Simulator, and debugging tools support professional workflows.' },
          { title: 'Pro Workflows', content: 'Mac Pro and Mac Studio serve demanding professional use cases. Video editing, 3D rendering, and software compilation benefit from high performance.' }
        ]
      },
      'iOS Updates': {
        intro: 'iOS continues to evolve with new features focused on user experience, privacy, and developer capabilities.',
        sections: [
          { title: 'User Experience Changes', content: 'New interaction models, widgets, and customization options give users more control over their devices.' },
          { title: 'Privacy Enhancements', content: 'App Tracking Transparency, privacy labels, and on-device processing protect user data while enabling app functionality.' },
          { title: 'Developer APIs', content: 'New frameworks expand what apps can accomplish. WidgetKit, App Clips, and SharePlay enable innovative experiences.' },
          { title: 'Compatibility Considerations', content: 'Supporting multiple iOS versions requires careful planning. Backward compatibility and feature detection ensure broad reach.' }
        ]
      },
      'AI Assistant Development': {
        intro: 'Building AI assistants requires understanding language models, tool integration, and conversation design.',
        sections: [
          { title: 'Architecture Components', content: 'Modern AI assistants combine language models with tool use, memory systems, and safety guardrails.' },
          { title: 'Tool Integration', content: 'Function calling enables assistants to interact with external systems. Proper schema design ensures reliable tool use.' },
          { title: 'Conversation Design', content: 'System prompts shape assistant behavior. Clear instructions, appropriate boundaries, and consistent personality improve user experience.' },
          { title: 'Deployment Patterns', content: 'Options range from cloud APIs to local deployment. Latency, privacy, and cost considerations influence architecture choices.' }
        ]
      },
      'Open Source AI Tools': {
        intro: 'The open source ecosystem provides powerful tools for AI development and deployment.',
        sections: [
          { title: 'Framework Landscape', content: 'PyTorch, TensorFlow, and JAX dominate deep learning. Hugging Face provides model sharing and tooling infrastructure.' },
          { title: 'Inference Solutions', content: 'llama.cpp, Ollama, and vLLM enable efficient local and cloud inference. Quantization techniques reduce resource requirements.' },
          { title: 'Evaluation Tools', content: 'Benchmarks and evaluation frameworks help assess model capabilities. Standardized testing enables meaningful comparisons.' },
          { title: 'Community Contributions', content: 'Open source communities drive innovation through shared models, datasets, and tooling. Collaboration accelerates progress.' }
        ]
      },
      'Web Performance Optimization': {
        intro: 'Web performance directly impacts user experience and search rankings. Optimization requires attention to multiple factors.',
        sections: [
          { title: 'Core Web Vitals', content: 'LCP, FID, and CLS measure user experience. Improving these metrics requires optimizing loading, interactivity, and visual stability.' },
          { title: 'Asset Optimization', content: 'Image compression, code splitting, and lazy loading reduce initial page weight. CDN distribution improves delivery speed.' },
          { title: 'Rendering Strategies', content: 'Server-side rendering, static generation, and hydration approaches affect perceived performance and SEO.' },
          { title: 'Monitoring and Measurement', content: 'Real User Monitoring captures actual performance. Lab testing with Lighthouse identifies optimization opportunities.' }
        ]
      },
      'Technical SEO Guide': {
        intro: 'Technical SEO ensures search engines can effectively crawl, understand, and index website content.',
        sections: [
          { title: 'Crawlability', content: 'Robots.txt, XML sitemaps, and internal linking guide search engine discovery. Crawl budget optimization ensures important pages are indexed.' },
          { title: 'Indexability', content: 'Canonical tags, noindex directives, and JavaScript rendering affect what gets indexed. Proper configuration prevents duplicate content issues.' },
          { title: 'Structured Data', content: 'Schema markup provides context for content types. Rich results improve visibility in search results.' },
          { title: 'Mobile Optimization', content: 'Responsive design, touch targets, and viewport configuration ensure mobile usability. Mobile-first indexing makes this essential.' }
        ]
      },
      'Streaming Technology': {
        intro: 'Streaming technology enables efficient delivery of audio and video content over the internet.',
        sections: [
          { title: 'Protocols and Formats', content: 'HLS and DASH dominate adaptive streaming. Codec selection affects quality and compatibility.' },
          { title: 'Adaptive Bitrate', content: 'ABR algorithms adjust quality based on network conditions. Viewer experience depends on smooth quality transitions.' },
          { title: 'CDN Architecture', content: 'Content delivery networks cache content at edge locations. Origin shielding and request collapsing optimize costs.' },
          { title: 'Live vs VOD', content: 'Live streaming requires ultra-low latency solutions. VOD benefits from aggressive caching and prefetching.' }
        ]
      },
      'Content Delivery Networks': {
        intro: 'CDNs accelerate content delivery by caching content at globally distributed edge locations.',
        sections: [
          { title: 'How CDNs Work', content: 'Edge servers cache copies of content closer to users. DNS routing directs requests to optimal locations.' },
          { title: 'Caching Strategies', content: 'Cache-Control headers, TTL settings, and purge mechanisms control content freshness. Origin shielding reduces backend load.' },
          { title: 'Performance Features', content: 'HTTP/3, Brotli compression, and early hints improve loading speed. Edge computing enables dynamic personalization.' },
          { title: 'Security Integration', content: 'DDoS protection, WAF rules, and bot detection complement caching. TLS termination at edge reduces latency.' }
        ]
      },
      'Electric Vehicle Technology': {
        intro: 'Electric vehicle technology continues to advance with improvements in efficiency, range, and charging infrastructure.',
        sections: [
          { title: 'Battery Technology', content: 'Lithium-ion batteries dominate current EVs. Solid-state batteries promise higher energy density and faster charging.' },
          { title: 'Motor and Drivetrain', content: 'Permanent magnet and induction motors offer different tradeoffs. Single-speed transmissions simplify mechanical design.' },
          { title: 'Charging Infrastructure', content: 'Level 2 home charging serves daily needs. DC fast charging enables long-distance travel. Network expansion improves convenience.' },
          { title: 'Software Integration', content: 'Over-the-air updates enable continuous improvement. Advanced driver assistance systems enhance safety and convenience.' }
        ]
      },
      'Autonomous Driving Systems': {
        intro: 'Autonomous driving combines sensors, AI, and control systems to enable vehicles to navigate without human input.',
        sections: [
          { title: 'Sensor Technologies', content: 'Cameras, radar, and lidar provide complementary perception. Sensor fusion combines data for robust environmental understanding.' },
          { title: 'AI Algorithms', content: 'Deep learning enables object detection and prediction. Planning algorithms determine safe vehicle trajectories.' },
          { title: 'Safety Architecture', content: 'Redundant systems and fail-safe mechanisms ensure safety. Validation requires extensive testing across diverse scenarios.' },
          { title: 'Regulatory Landscape', content: 'Standards and regulations vary by region. Liability frameworks continue to evolve as technology matures.' }
        ]
      },
      'Network Security': {
        intro: 'Network security protects systems and data from unauthorized access and malicious activities.',
        sections: [
          { title: 'Defense in Depth', content: 'Multiple security layers provide comprehensive protection. Firewalls, IDS/IPS, and segmentation create barriers.' },
          { title: 'Encryption Standards', content: 'TLS protects data in transit. AES secures stored data. Key management is critical for effective encryption.' },
          { title: 'Access Control', content: 'Authentication verifies identity. Authorization determines permissions. Multi-factor authentication strengthens security.' },
          { title: 'Threat Detection', content: 'SIEM systems aggregate and analyze logs. Behavioral analytics identify anomalies. Automated response reduces reaction time.' }
        ]
      },
      'Privacy Protection': {
        intro: 'Privacy protection involves technical and organizational measures to safeguard personal information.',
        sections: [
          { title: 'Data Minimization', content: 'Collecting only necessary data reduces risk. Purpose limitation ensures data is used appropriately.' },
          { title: 'Encryption and Anonymization', content: 'End-to-end encryption protects communications. Anonymization techniques remove identifying information.' },
          { title: 'Consent Management', content: 'Clear privacy notices inform users. Granular consent options respect user preferences.' },
          { title: 'Compliance Requirements', content: 'GDPR, CCPA, and other regulations impose obligations. Compliance programs ensure organizational adherence.' }
        ]
      },
      'Blockchain Fundamentals': {
        intro: 'Blockchain technology provides a decentralized, immutable ledger for recording transactions and data.',
        sections: [
          { title: 'Core Concepts', content: 'Blocks contain transaction data linked through cryptographic hashes. Consensus mechanisms ensure network agreement.' },
          { title: 'Types of Blockchains', content: 'Public, private, and consortium chains serve different use cases. Permission models affect decentralization and control.' },
          { title: 'Smart Contracts', content: 'Programmable logic enables automated execution. Code audits and testing prevent vulnerabilities.' },
          { title: 'Scalability Solutions', content: 'Layer 2 solutions, sharding, and alternative consensus mechanisms address throughput limitations.' }
        ]
      },
      'Decentralized Finance': {
        intro: 'DeFi recreates financial services using blockchain technology and smart contracts.',
        sections: [
          { title: 'Core Primitives', content: 'Decentralized exchanges enable token swapping. Lending protocols allow borrowing without intermediaries.' },
          { title: 'Yield Mechanisms', content: 'Liquidity provision, staking, and lending generate returns. Understanding risks is essential for participation.' },
          { title: 'Stablecoins', content: 'Fiat-backed, crypto-collateralized, and algorithmic stablecoins serve different purposes. Reserve transparency builds trust.' },
          { title: 'Risk Considerations', content: 'Smart contract bugs, oracle failures, and market volatility pose risks. Due diligence protects participants.' }
        ]
      }
    };

    // 通用模板
    const defaultContent = {
      intro: `${topic} is a significant area of development with practical implications for technology and business.`,
      sections: [
        { title: 'Fundamental Concepts', content: `Understanding ${topic.toLowerCase()} requires grasp of core principles. These foundations guide practical implementation and informed decision-making.` },
        { title: 'Current Developments', content: `The field advances through innovation from established companies and startups. Open source contributions accelerate progress and accessibility.` },
        { title: 'Practical Applications', content: `Real-world implementations span diverse industries. Successful projects share careful planning, appropriate technology selection, and iterative improvement.` },
        { title: 'Future Outlook', content: `Emerging trends suggest continued evolution. Professionals who stay informed and adaptable will leverage new capabilities effectively.` }
      ]
    };

    return contentMap[topic] || defaultContent;
  }

  // 生成文章
  generateArticle(channel, topic) {
    console.log(`✍️ Generating: ${topic}`);
    
    const data = this.generateArticleContent(channel, topic);
    const slug = `${channel.id}-${this.currentDate}-${topic.toLowerCase().replace(/\s+/g, '-')}`;
    
    let content = `# ${topic}\n\n${data.intro}\n\n`;
    
    for (const section of data.sections) {
      content += `## ${section.title}\n\n${section.content}\n\n`;
    }
    
    content += `---\n\n*Published on wordok.top — ${this.currentDate}*\n`;
    
    return { title: topic, slug, content };
  }

  // 保存文章
  saveArticle(channel, article) {
    const postsDir = path.join(PROJECT_PATH, 'sites', channel.id, 'posts');
    
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }
    
    const filepath = path.join(postsDir, `${article.slug}.md`);
    
    // 检查文件是否已存在（避免重复）
    if (fs.existsSync(filepath)) {
      console.log(`   ⏭️ Skipped (already exists): ${article.slug}`);
      return null;
    }
    
    const frontmatter = `---
title: "${article.title}"
description: "Learn about ${article.title.toLowerCase()} - key concepts and practical insights."
keywords: ${JSON.stringify(article.title.toLowerCase().split(' '))}
pubDate: "${this.currentDate}"
author: "wordok"
---

${article.content}`;

    fs.writeFileSync(filepath, frontmatter, 'utf8');
    this.articlesGenerated++;
    return filepath;
  }

  // 生成报告（不推送）
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📋 DAILY CONTENT GENERATION REPORT');
    console.log('='.repeat(60));
    console.log(`📅 Date: ${this.currentDate}`);
    console.log(`📊 Articles generated: ${this.articlesGenerated}`);
    console.log(`📁 Channels covered: ${CHANNELS.length}`);
    
    if (this.generatedFiles.length > 0) {
      console.log('\n📄 Generated files:');
      this.generatedFiles.forEach((file, index) => {
        const relativePath = path.relative(PROJECT_PATH, file);
        console.log(`   ${index + 1}. ${relativePath}`);
      });
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('⚠️ READY TO COMMIT AND PUSH');
    console.log('='.repeat(60));
    console.log('\nPlease confirm to proceed with git commit and push.');
    console.log('Reply "yes" or "confirm" to proceed, or "no" to cancel.');
  }

  // 执行
  async execute() {
    console.log('='.repeat(60));
    console.log('🚀 SEO SITES DAILY CONTENT GENERATION');
    console.log('='.repeat(60));
    console.log(`📅 Date: ${this.currentDate}`);
    console.log(`🎯 Target: 1 new article per channel (${CHANNELS.length} channels)\n`);
    
    // Git同步
    await this.gitSync();
    
    // 步骤1：总结每个频道最近10篇文章
    console.log('📊 STEP 1: Analyzing recent articles per channel\n');
    for (const channel of CHANNELS) {
      const recentArticles = this.getRecentArticles(channel.id);
      this.channelSummary[channel.id] = recentArticles;
      this.generateTopicSummary(channel.id, recentArticles);
    }
    
    // 步骤2：为每个频道生成1篇新文章
    console.log('✍️ STEP 2: Generating new articles\n');
    for (const channel of CHANNELS) {
      console.log(`\n[${channel.id.toUpperCase()}]`);
      
      const recentArticles = this.channelSummary[channel.id];
      const topic = this.selectNewTopic(channel, recentArticles);
      
      console.log(`   Selected topic: ${topic}`);
      
      const article = this.generateArticle(channel, topic);
      const filepath = this.saveArticle(channel, article);
      
      if (filepath) {
        this.generatedFiles.push(filepath);
        console.log(`   ✅ Generated: ${article.slug}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // 生成报告
    this.generateReport();
    
    return {
      success: true,
      articlesGenerated: this.articlesGenerated,
      files: this.generatedFiles,
      date: this.currentDate
    };
  }
}

// 执行任务
const task = new SEODailyTask();
const result = await task.execute();

process.exit(result.success ? 0 : 1);
