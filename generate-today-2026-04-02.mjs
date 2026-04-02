#!/usr/bin/env node

/**
 * SEO Article Generator for 2026-04-02
 * Generates articles with proper YAML frontmatter for all 8 channels
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const PROJECT_PATH = path.resolve(__dirname);
const TODAY = '2026-04-02';
const CHANNELS = [
    { 
        id: 'ai', 
        name: 'Artificial Intelligence', 
        category: 'Artificial Intelligence',
        tags: ['AI', 'Machine Learning', 'AGI', 'Deep Learning', 'LLMs'],
        excerpt: 'Latest AI trends, research breakthroughs, and industry developments in 2026.'
    },
    { 
        id: 'apple', 
        name: 'Apple Products', 
        category: 'Technology',
        tags: ['iPhone', 'Mac', 'iOS', 'Apple Ecosystem', 'Technology'],
        excerpt: 'Apple product updates, ecosystem analysis, and future technology trends.'
    },
    { 
        id: 'openclaw', 
        name: 'Open Source Tools', 
        category: 'Development',
        tags: ['Open Source', 'AI Assistants', 'Development Tools', 'Automation'],
        excerpt: 'Open source tools, AI assistants, and development automation solutions.'
    },
    { 
        id: 'site-a', 
        name: 'SEO Technology', 
        category: 'Marketing',
        tags: ['SEO', 'Search Engine Optimization', 'Content Marketing', 'Digital Marketing'],
        excerpt: 'SEO strategies, search engine optimization techniques, and content marketing insights.'
    },
    { 
        id: 'streaming', 
        name: 'Streaming Services', 
        category: 'Entertainment',
        tags: ['Netflix', 'Disney+', 'Streaming', 'Entertainment', 'Content'],
        excerpt: 'Streaming service reviews, content recommendations, and entertainment trends.'
    },
    { 
        id: 'tesla', 
        name: 'Tesla & EVs', 
        category: 'Automotive',
        tags: ['Tesla', 'Electric Vehicles', 'EVs', 'Autonomous Driving', 'Clean Energy'],
        excerpt: 'Tesla innovations, electric vehicle technology, and sustainable energy solutions.'
    },
    { 
        id: 'vpn-usa', 
        name: 'VPN & Security', 
        category: 'Security',
        tags: ['VPN', 'Security', 'Privacy', 'Cyber Security', 'Encryption'],
        excerpt: 'VPN reviews, security best practices, privacy protection, and online safety.'
    },
    { 
        id: 'web3', 
        name: 'Blockchain & Web3', 
        category: 'Technology',
        tags: ['Web3', 'Blockchain', 'Cryptocurrency', 'DeFi', 'NFT'],
        excerpt: 'Web3 technologies, blockchain developments, cryptocurrency trends, and decentralized finance.'
    }
];

// Helper functions
function generateArticleTitle(channelId, channelName) {
    const topics = {
        'ai': ['AI Governance', 'Multimodal AI', 'Edge AI', 'AI Ethics', 'Generative AI'],
        'apple': ['iOS 20', 'MacBook M4', 'Apple Vision Pro', 'Apple Intelligence', 'iPhone 18'],
        'openclaw': ['AI Assistants', 'Code Generation', 'Automation Tools', 'Open Source AI', 'Developer Productivity'],
        'site-a': ['SEO Algorithms', 'Content Strategy', 'Keyword Research', 'Technical SEO', 'Local SEO'],
        'streaming': ['Streaming Wars', 'Original Content', 'Subscription Models', '4K HDR', 'Global Expansion'],
        'tesla': ['Model 3 Refresh', 'Cybertruck Production', 'Autopilot Updates', 'Battery Technology', 'Supercharger Network'],
        'vpn-usa': ['Privacy Laws', 'VPN Protocols', 'Zero Trust Security', 'Data Encryption', 'Geo-restrictions'],
        'web3': ['Layer 2 Solutions', 'DeFi Innovations', 'NFT Marketplaces', 'Smart Contracts', 'Decentralized Identity']
    };
    
    const channelTopics = topics[channelId] || ['Technology', 'Innovation', 'Trends'];
    const randomTopic = channelTopics[Math.floor(Math.random() * channelTopics.length)];
    return `${randomTopic} in 2026: Comprehensive Analysis and Future Outlook`;
}

function generateArticleContent(channelId, channelName) {
    const contentTemplates = {
        'ai': `The field of ${channelName} is undergoing rapid transformation in 2026. Recent developments in artificial intelligence are reshaping industries, creating new opportunities, and raising important ethical questions.

## Key Developments

1. **Advanced AI Models**: New multimodal AI systems are demonstrating unprecedented capabilities in understanding and generating content across text, images, and audio.

2. **AI Governance**: Governments worldwide are implementing new regulations to ensure responsible AI development and deployment.

3. **Edge AI**: The shift towards edge computing is enabling AI applications to run locally on devices, improving privacy and reducing latency.

4. **AI Ethics**: Increasing focus on fairness, transparency, and accountability in AI systems is driving new research and best practices.

## Industry Impact

The impact of ${channelName} extends across multiple sectors:
- **Healthcare**: AI-assisted diagnosis and treatment planning
- **Finance**: Fraud detection and algorithmic trading
- **Manufacturing**: Predictive maintenance and quality control
- **Education**: Personalized learning and automated grading

## Future Outlook

Looking ahead to 2027 and beyond, we can expect continued innovation in ${channelName}. Key areas to watch include quantum AI, brain-computer interfaces, and truly general artificial intelligence.

## References

- MIT Technology Review AI Coverage
- AI Research Papers Database
- TechCrunch AI Industry Reports`,
        
        'apple': `Apple's ecosystem continues to evolve in 2026, with new products and services shaping the technology landscape. The integration of hardware, software, and services remains Apple's key strength.

## Product Innovations

1. **iPhone 18**: Expected features include under-display Face ID, enhanced camera systems, and improved battery technology.

2. **MacBook M4**: Next-generation Apple Silicon promises significant performance improvements for professional workflows.

3. **Apple Vision Pro**: Spatial computing is becoming more accessible with refined hardware and expanded software support.

4. **Apple Intelligence**: AI integration across Apple's ecosystem is creating new user experiences and productivity tools.

## Software Ecosystem

- **iOS 20**: Enhanced privacy features, improved Siri capabilities, and new developer tools
- **macOS 15**: Better continuity between Apple devices and enhanced security features
- **watchOS 11**: Advanced health monitoring and fitness tracking capabilities

## Market Strategy

Apple's focus on services continues to grow, with increasing revenue from:
- Apple Music and Apple TV+
- Apple Arcade and Apple News+
- iCloud storage and AppleCare
- Apple Pay and Apple Card

## Competitive Landscape

Apple faces competition from:
- Samsung in the smartphone market
- Microsoft in productivity software
- Google in AI and services
- Meta in augmented reality`,
        
        'tesla': `Tesla continues to lead the electric vehicle revolution in 2026, with innovations in battery technology, autonomous driving, and energy storage.

## Vehicle Updates

1. **Model 3 Refresh**: Updated interior, improved range, and enhanced autopilot capabilities
2. **Cybertruck Production**: Scaling production to meet high demand for this revolutionary vehicle
3. **Model Y Updates**: Refinements to popular SUV model with better efficiency
4. **Roadster 2.0**: Progress on next-generation high-performance electric sports car

## Technology Innovations

- **4680 Battery Cells**: Improved energy density and faster charging capabilities
- **Full Self-Driving**: Advancements in neural networks and sensor fusion
- **Supercharger V4**: Faster charging speeds and better network coverage
- **Tesla Bot**: Progress in humanoid robotics for manufacturing and service applications

## Energy Solutions

Tesla's energy division continues to grow:
- **Powerwall 3**: Enhanced home energy storage solutions
- **Megapack**: Large-scale energy storage for utilities and commercial applications
- **Solar Roof**: Integrated solar solutions for residential and commercial buildings

## Market Expansion

Tesla is expanding globally with:
- New Gigafactories in strategic locations
- Increased production capacity for existing models
- Entry into new vehicle segments
- Growth in energy storage business`,
        
        'default': `The ${channelName} sector is experiencing significant growth and innovation in 2026. This comprehensive analysis examines the latest trends, technological advancements, and market developments shaping the industry.

## Current State of the Industry

Recent market data indicates strong growth in the ${channelName} sector, driven by technological innovation, changing consumer preferences, and evolving regulatory frameworks.

## Technological Advancements

Key technological developments include:
1. **New Platforms and Protocols**: Enhanced capabilities and improved performance
2. **Integration with AI**: Leveraging artificial intelligence for better user experiences
3. **Mobile Optimization**: Focus on mobile-first approaches and responsive design
4. **Security Enhancements**: Improved protection against emerging threats

## Market Trends

Analysis of current market trends reveals:
- Growing adoption among consumers and businesses
- Increasing investment from venture capital and corporate players
- Expansion into new geographic markets
- Diversification of products and services

## Regulatory Environment

The regulatory landscape for ${channelName} is evolving, with:
- New consumer protection measures
- Data privacy regulations
- Industry standards development
- International cooperation on governance

## Future Outlook

Looking forward, the ${channelName} sector is expected to continue its growth trajectory through 2027 and beyond. Key areas of focus include sustainability, accessibility, and integration with emerging technologies.`
    };
    
    return contentTemplates[channelId] || contentTemplates.default;
}

async function main() {
    console.log(`🚀 Starting SEO article generation for ${TODAY}`);
    console.log(`   Project: wordok.top`);
    console.log(`   Channels: ${CHANNELS.length}`);
    
    // Create output directory
    const outputDir = path.join(PROJECT_PATH, 'docs', 'articles', TODAY);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    console.log(`   Created output directory: ${outputDir}`);
    
    let articlesGenerated = 0;
    
    // Generate articles for each channel
    for (const channel of CHANNELS) {
        // Generate 2 articles per channel
        for (let i = 1; i <= 2; i++) {
            const articleTitle = generateArticleTitle(channel.id, channel.name);
            const articleContent = generateArticleContent(channel.id, channel.name);
            
            // Create YAML frontmatter
            const frontmatter = `---
title: "${articleTitle}"
date: ${TODAY}
author: "WordOK Tech"
category: "${channel.category}"
tags: ${JSON.stringify(channel.tags)}
excerpt: "${channel.excerpt}"
---

${articleContent}`;
            
            const filename = `${channel.id}-${TODAY}-article-${i}.md`;
            const filepath = path.join(outputDir, filename);
            
            fs.writeFileSync(filepath, frontmatter, 'utf8');
            console.log(`   ✅ Generated: ${filename}`);
            articlesGenerated++;
        }
    }
    
    // Also generate files for website integration
    const distOutputDir = path.join(PROJECT_PATH, 'dist', 'ai', 'posts', `ai-${TODAY}-analysis`);
    if (!fs.existsSync(distOutputDir)) {
        fs.mkdirSync(distOutputDir, { recursive: true });
    }
    
    // Create website index file for AI channel
    if (CHANNELS.some(c => c.id === 'ai')) {
        const aiChannel = CHANNELS.find(c => c.id === 'ai');
        const aiTitle = generateArticleTitle('ai', 'Artificial Intelligence');
        const aiContent = generateArticleContent('ai', 'Artificial Intelligence');
        
        const indexContent = `---
title: "${aiTitle}"
date: ${TODAY}
author: "WordOK Tech"
category: "${aiChannel.category}"
tags: ${JSON.stringify(aiChannel.tags)}
excerpt: "${aiChannel.excerpt}"
---

${aiContent}`;
        
        fs.writeFileSync(path.join(distOutputDir, 'index.md'), indexContent, 'utf8');
        console.log(`   ✅ Created website article: ai/${TODAY}`);
    }
    
    console.log(`\n🎉 Generation completed!`);
    console.log(`   Total articles: ${articlesGenerated}`);
    console.log(`   Date: ${TODAY}`);
    console.log(`   Output: ${outputDir}`);
    console.log(`   Website: dist/ai/posts/ai-${TODAY}-analysis/`);
    
    // Create report
    const report = {
        date: TODAY,
        channels: CHANNELS.length,
        articlesPerChannel: 2,
        totalArticles: articlesGenerated,
        generatedAt: new Date().toISOString(),
        project: 'wordok.top',
        frontmatterIncluded: true
    };
    
    const reportPath = path.join(PROJECT_PATH, 'reports', `generation-${TODAY}.json`);
    const reportDir = path.dirname(reportPath);
    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir, { recursive: true });
    }
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8');
    console.log(`   Report: ${reportPath}`);
    
    return report;
}

// Run with error handling
try {
    const result = await main();
    console.log('\n✅ SEO article generation successful!');
    
    // Also copy to site directories
    console.log('\n📁 Copying articles to site directories...');
    
    // For each channel, copy articles to appropriate site posts directory
    for (const channel of CHANNELS) {
        const sitePostsDir = path.join(PROJECT_PATH, 'sites', channel.id, 'posts');
        if (fs.existsSync(sitePostsDir)) {
            // Copy both articles for this channel
            for (let i = 1; i <= 2; i++) {
                const sourceFile = path.join(PROJECT_PATH, 'docs', 'articles', TODAY, `${channel.id}-${TODAY}-article-${i}.md`);
                const destFile = path.join(sitePostsDir, `${channel.id}-${TODAY}-analysis-${i}.md`);
                
                if (fs.existsSync(sourceFile)) {
                    const content = fs.readFileSync(sourceFile, 'utf8');
                    fs.writeFileSync(destFile, content, 'utf8');
                    console.log(`   ✅ Copied: ${channel.id}-${TODAY}-analysis-${i}.md to sites/${channel.id}/posts/`);
                }
            }
        }
    }
    
    console.log('\n✅ All articles generated and copied successfully!');
    console.log(`\n📅 Today's date: ${TODAY}`);
    console.log(`📈 Total articles: ${CHANNELS.length * 2}`);
    console.log(`🎯 All articles include proper YAML frontmatter for correct website sorting.`);
    
    process.exit(0);
} catch (error) {
    console.error('\n❌ Generation failed:', error.message);
    console.error(error.stack);
    process.exit(1);
}