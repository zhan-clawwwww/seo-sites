#!/usr/bin/env node
/**
 * SEO网站每日内容生成任务 - 面向用户的英文文章
 * 周一到周六上午9:30执行
 * 为8个频道各生成2篇高质量英文文章
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const PROJECT_PATH = path.resolve(__dirname);

const CHANNELS = [
  { 
    id: 'ai', 
    topics: [
      'Artificial General Intelligence',
      'Machine Learning Breakthroughs',
      'Large Language Models',
      'AI Ethics and Safety',
      'Computer Vision Advances'
    ]
  },
  { 
    id: 'apple', 
    topics: [
      'iPhone Development',
      'Mac Innovation',
      'iOS Updates',
      'Apple Silicon',
      'Apple Ecosystem'
    ]
  },
  { 
    id: 'openclaw', 
    topics: [
      'AI Assistant Development',
      'Open Source AI Tools',
      'Workflow Automation',
      'Developer Productivity',
      'Local AI Deployment'
    ]
  },
  { 
    id: 'site-a', 
    topics: [
      'Web Performance Optimization',
      'Technical SEO Guide',
      'Content Strategy',
      'Site Architecture',
      'Core Web Vitals'
    ]
  },
  { 
    id: 'streaming', 
    topics: [
      'Streaming Technology',
      'Content Delivery Networks',
      'Video Compression',
      'Live Streaming Platforms',
      'OTT Services'
    ]
  },
  { 
    id: 'tesla', 
    topics: [
      'Electric Vehicle Technology',
      'Autonomous Driving Systems',
      'Battery Innovation',
      'EV Market Trends',
      'Sustainable Transportation'
    ]
  },
  { 
    id: 'vpn-usa', 
    topics: [
      'Network Security Best Practices',
      'Privacy Protection Guide',
      'Encryption Technologies',
      'Secure Communications',
      'Cybersecurity Trends'
    ]
  },
  { 
    id: 'web3', 
    topics: [
      'Blockchain Fundamentals',
      'Decentralized Finance',
      'Smart Contract Development',
      'Web3 Infrastructure',
      'Digital Assets'
    ]
  }
];

class SEODailyTask {
  constructor() {
    this.currentDate = new Date().toISOString().split('T')[0];
    this.articlesGenerated = 0;
  }

  // Git同步
  async gitSync() {
    console.log('Syncing with Git repository...');
    try {
      execSync('git pull', { stdio: 'inherit', cwd: PROJECT_PATH });
      console.log('Git sync complete');
    } catch (error) {
      console.log('Git sync skipped (no remote or network issue)');
    }
  }

  // 生成高质量英文文章
  async generateArticle(channel, topic) {
    console.log(`Generating article: ${topic}`);
    
    const slug = `${channel.id}-${this.currentDate}-${topic.toLowerCase().replace(/\s+/g, '-')}`;
    
    // 根据主题生成针对性的文章内容
    const content = this.generateTopicContent(channel, topic);
    
    return {
      title: topic,
      slug,
      content
    };
  }

  // 根据主题生成具体内容
  generateTopicContent(channel, topic) {
    // 每个主题的具体内容模板
    const topicContent = {
      'Artificial General Intelligence': {
        intro: `Artificial General Intelligence (AGI) represents the next frontier in AI development—systems that can understand, learn, and apply knowledge across any domain, much like human cognition.`,
        sections: [
          {
            title: 'Understanding AGI vs Narrow AI',
            content: `Unlike narrow AI systems designed for specific tasks like image recognition or language translation, AGI would possess the flexibility to handle novel situations it wasn't explicitly programmed for. Current AI excels in defined domains but struggles when faced with unfamiliar scenarios. AGI aims to bridge this gap through more generalizable learning mechanisms.`
          },
          {
            title: 'Current Research Directions',
            content: `Researchers are exploring multiple pathways toward AGI. Neuromorphic computing attempts to mimic brain architecture, while approaches like meta-learning focus on teaching systems how to learn. Transformer architectures have shown promise in handling diverse tasks, suggesting a path toward more general capabilities. Foundation models trained on broad datasets demonstrate emergent abilities not explicitly trained.`
          },
          {
            title: 'Technical Challenges',
            content: `Key obstacles include transfer learning across domains, common sense reasoning, and efficient sample learning. Current deep learning systems require enormous datasets, whereas humans learn from few examples. Energy efficiency presents another challenge—human brains operate on roughly 20 watts while training large models consumes megawatts.`
          },
          {
            title: 'Implications for Society',
            content: `AGI would transform virtually every industry. Healthcare could see AI systems diagnosing rare diseases, scientific research could accelerate through automated hypothesis generation, and education could personalize to each learner. However, these benefits come with significant safety considerations that require careful attention.`
          }
        ]
      },
      'Machine Learning Breakthroughs': {
        intro: `Machine learning continues to evolve rapidly, with recent breakthroughs pushing the boundaries of what automated systems can accomplish across diverse domains.`,
        sections: [
          {
            title: 'Recent Architectural Advances',
            content: `State-space models like Mamba offer efficient alternatives to transformers for long sequences. Diffusion models have revolutionized generative AI, enabling high-quality image and video creation. Sparse mixture-of-experts architectures allow larger models without proportional computational increases.`
          },
          {
            title: 'Learning Efficiency Improvements',
            content: `New techniques like LoRA and QLoRA enable fine-tuning large models on consumer hardware. Retrieval-augmented generation reduces hallucination while keeping models current. Self-supervised learning continues to improve, requiring less labeled data for training.`
          },
          {
            title: 'Emerging Applications',
            content: `Protein structure prediction has advanced dramatically, enabling new drug discovery approaches. Code generation tools now produce production-ready software. Scientific discovery applications identify patterns in data that humans might miss, accelerating research across fields.`
          },
          {
            title: 'Infrastructure Evolution',
            content: `Model compression techniques make deployment on edge devices practical. Distributed training frameworks enable larger models. MLOps practices mature, making production deployment more reliable and maintainable.`
          }
        ]
      },
      'Large Language Models': {
        intro: `Large Language Models have transformed how we interact with AI, demonstrating remarkable capabilities in understanding and generating human-like text.`,
        sections: [
          {
            title: 'Architecture and Training',
            content: `Modern LLMs use transformer architectures with self-attention mechanisms. Training involves pre-training on vast text corpora followed by instruction tuning and reinforcement learning from human feedback. Context windows have expanded dramatically, enabling processing of entire books in a single prompt.`
          },
          {
            title: 'Capabilities and Limitations',
            content: `Current LLMs excel at tasks like summarization, translation, code generation, and reasoning. However, they can hallucinate facts, struggle with mathematical calculations, and lack true understanding of the physical world. Multimodal models address some limitations by incorporating visual and audio understanding.`
          },
          {
            title: 'Deployment Considerations',
            content: `Quantization and distillation make LLMs accessible on consumer hardware. API-based deployment offers scalability without infrastructure management. Local deployment provides privacy and offline capability. Choosing between cloud and local depends on latency requirements, data sensitivity, and cost constraints.`
          },
          {
            title: 'Future Directions',
            content: `Research focuses on improved reasoning, factual accuracy, and efficiency. Mixture-of-experts models promise better performance per parameter. Long-context models aim to process entire codebases or research libraries. Tool use and agentic capabilities expand what LLMs can accomplish.`
          }
        ]
      }
    };

    // 通用模板，用于没有特定内容的主题
    const defaultContent = {
      intro: `${topic} is a rapidly evolving field with significant implications for technology and society. Understanding its fundamentals and developments is essential for anyone working in related domains.`,
      sections: [
        {
          title: 'Fundamental Concepts',
          content: `At its core, ${topic.toLowerCase()} involves understanding key principles that govern how systems operate in this domain. These fundamentals provide the foundation for practical applications and further innovation. Mastering these concepts enables practitioners to make informed decisions and avoid common pitfalls.`
        },
        {
          title: 'Current State of the Field',
          content: `The field has seen rapid advancement in recent years, driven by improvements in underlying technologies and increased investment. Major players and startups alike are pushing boundaries, while open-source communities contribute to democratizing access. Standards and best practices are still emerging, making it an exciting time for newcomers.`
        },
        {
          title: 'Practical Applications',
          content: `Real-world applications span industries from healthcare to finance, entertainment to education. Successful implementations share common characteristics: clear problem definition, appropriate technology selection, and iterative improvement. Understanding these patterns helps identify opportunities and avoid unrealistic expectations.`
        },
        {
          title: 'Looking Ahead',
          content: `Emerging trends suggest continued evolution in both capabilities and accessibility. Integration with other technologies creates new possibilities, while regulatory frameworks begin to take shape. Professionals who stay informed and adaptable will be best positioned to leverage these developments.`
        }
      ]
    };

    const data = topicContent[topic] || defaultContent;
    
    let content = `# ${topic}\n\n${data.intro}\n\n`;
    
    for (const section of data.sections) {
      content += `## ${section.title}\n\n${section.content}\n\n`;
    }
    
    content += `---\n\n*Published on wordok.top — ${this.currentDate}*\n`;
    
    return content;
  }

  // 保存文章
  async saveArticle(channel, article) {
    const postsDir = path.join(PROJECT_PATH, 'sites', channel.id, 'posts');
    
    if (!fs.existsSync(postsDir)) {
      fs.mkdirSync(postsDir, { recursive: true });
    }
    
    const filename = `${article.slug}.md`;
    const filepath = path.join(postsDir, filename);
    
    const frontmatter = `---
title: "${article.title}"
description: "Learn about ${article.title.toLowerCase()} - key concepts, current developments, and practical insights."
keywords: ${JSON.stringify(article.title.toLowerCase().split(' '))}
pubDate: "${this.currentDate}"
author: "wordok"
---

${article.content}`;

    fs.writeFileSync(filepath, frontmatter, 'utf8');
    console.log(`  Saved: ${filepath}`);
    
    this.articlesGenerated++;
    return filepath;
  }

  // 主执行流程
  async execute() {
    console.log('='.repeat(60));
    console.log('SEO Sites Daily Content Generation');
    console.log('='.repeat(60));
    console.log(`Date: ${this.currentDate}`);
    console.log(`Target: 2 articles per channel (8 channels = 16 articles total)\n`);
    
    try {
      // Git同步
      await this.gitSync();
      
      const generatedFiles = [];
      
      // 为每个频道生成文章
      for (const channel of CHANNELS) {
        console.log(`\n[${channel.id.toUpperCase()}] Generating 2 articles...`);
        
        for (let i = 0; i < 2; i++) {
          const topicIndex = (this.articlesGenerated + i) % channel.topics.length;
          const topic = channel.topics[topicIndex];
          
          try {
            const article = await this.generateArticle(channel, topic);
            const filepath = await this.saveArticle(channel, article);
            generatedFiles.push(filepath);
            console.log(`  Article ${i + 1}: ${topic}`);
            
            await new Promise(resolve => setTimeout(resolve, 300));
            
          } catch (error) {
            console.error(`  Failed to generate article ${i + 1}:`, error.message);
          }
        }
      }
      
      // 提交代码
      if (generatedFiles.length > 0) {
        console.log('\n' + '='.repeat(60));
        console.log('Committing changes...');
        
        try {
          execSync('git add -A', { stdio: 'inherit', cwd: PROJECT_PATH });
          execSync(`git commit -m "content: auto-generated ${this.currentDate} - ${this.articlesGenerated} articles"`, { stdio: 'inherit', cwd: PROJECT_PATH });
          console.log('Committed locally');
          
          try {
            execSync('git push', { stdio: 'inherit', cwd: PROJECT_PATH });
            console.log('Pushed to remote');
          } catch (pushError) {
            console.log('Push skipped (no remote configured or network issue)');
          }
        } catch (error) {
          console.log('Commit skipped (no changes or git not configured)');
        }
      }
      
      // 完成报告
      console.log('\n' + '='.repeat(60));
      console.log('TASK COMPLETE');
      console.log('='.repeat(60));
      console.log(`Articles generated: ${this.articlesGenerated}`);
      console.log(`Channels covered: ${CHANNELS.length}`);
      console.log(`Date: ${this.currentDate}`);
      
      if (generatedFiles.length > 0) {
        console.log('\nGenerated files:');
        generatedFiles.forEach((file, index) => {
          const relativePath = path.relative(PROJECT_PATH, file);
          console.log(`  ${index + 1}. ${relativePath}`);
        });
      }
      
      return {
        success: true,
        articlesGenerated: this.articlesGenerated,
        files: generatedFiles,
        date: this.currentDate
      };
      
    } catch (error) {
      console.error('Task failed:', error);
      return {
        success: false,
        error: error.message,
        articlesGenerated: this.articlesGenerated
      };
    }
  }
}

// 执行任务
const task = new SEODailyTask();
const result = await task.execute();

process.exit(result.success ? 0 : 1);
