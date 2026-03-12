import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const postsDir = join(process.cwd(), "sites", "vpn-usa", "posts");
mkdirSync(postsDir, { recursive: true });

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function generateArticle(keyword, title) {
  const slug = slugify(keyword);
  const pubDate = new Date().toISOString().split("T")[0];
  
  // 生成 3-5 个小标题（随机选择）
  const subtitles = [
    `为什么选择${title.includes("美国") ? "" : "美国"}VPN服务`,
    `如何选择最适合的${title.includes("美国") ? "" : "美国"}VPN`,
    `${title.includes("美国") ? "" : "美国"}VPN的核心功能`,
    `使用${title.includes("美国") ? "" : "美国"}VPN的注意事项`,
    `${title.includes("美国") ? "" : "美国"}VPN价格对比`,
    `最佳${title.includes("美国") ? "" : "美国"}VPN推荐`,
    `${title.includes("美国") ? "" : "美国"}VPN安全性分析`,
    `如何设置${title.includes("美国") ? "" : "美国"}VPN`,
  ];
  
  const selectedSubtitles = subtitles
    .sort(() => Math.random() - 0.5)
    .slice(0, 3 + Math.floor(Math.random() * 3)); // 3-5 个
  
  // 生成文章内容（约 1500 字）
  const intro = `${title}是当前网络用户关注的热点话题。随着网络安全和隐私保护意识的提升，越来越多的用户开始寻找可靠的VPN解决方案。本文将深入探讨${title}的各个方面，帮助您做出明智的选择。`;
  
  const bodySections = selectedSubtitles.map((subtitle, idx) => {
    const sectionContent = `
## ${subtitle}

${title}的选择需要考虑多个因素。首先，服务器的地理位置和数量直接影响连接速度和稳定性。优质的${title.includes("美国") ? "" : "美国"}VPN服务提供商通常在全球部署大量服务器，确保用户能够获得最佳的网络体验。

其次，加密技术和协议的选择至关重要。现代${title.includes("美国") ? "" : "美国"}VPN服务多采用AES-256加密标准，配合WireGuard或OpenVPN等先进协议，能够有效保护用户数据安全。同时，无日志政策也是评估${title.includes("美国") ? "" : "美国"}VPN服务的重要标准，确保您的在线活动不会被记录或追踪。

此外，${title.includes("美国") ? "" : "美国"}VPN的兼容性也是需要考虑的因素。优秀的服务应该支持Windows、macOS、iOS、Android等主流操作系统，并提供浏览器扩展和路由器配置选项。对于需要同时保护多台设备的用户，多设备同时连接功能也是必不可少的。

价格方面，${title.includes("美国") ? "" : "美国"}VPN服务的定价策略各不相同。虽然免费VPN看似诱人，但通常存在速度限制、数据流量限制或隐私风险。付费服务虽然需要一定成本，但能够提供更稳定、更安全的服务体验。建议用户根据自身需求选择合适的价格方案，通常长期订阅能够获得更优惠的价格。

最后，客户支持质量也是选择${title.includes("美国") ? "" : "美国"}VPN服务时不可忽视的因素。专业的服务提供商应该提供7x24小时在线支持，包括实时聊天、邮件支持和详细的知识库，帮助用户解决使用过程中遇到的各种问题。`;
    return sectionContent;
  }).join("\n\n");
  
  const conclusion = `总的来说，${title}的选择需要综合考虑多个因素。无论是为了保护隐私、访问受限内容，还是提升网络安全性，选择合适的${title.includes("美国") ? "" : "美国"}VPN服务都是明智的决定。建议用户在选择时进行充分调研，阅读用户评价，并利用免费试用期测试服务质量，最终找到最适合自己需求的解决方案。`;
  
  // 生成 FAQ（3-5 个问题）
  const faqQuestions = [
    {
      question: `${title}的主要优势是什么？`,
      answer: `${title}的主要优势包括：提供强大的加密保护，确保您的网络活动不被监控；允许访问地理位置受限的内容和服务；保护公共Wi-Fi环境下的数据安全；隐藏真实IP地址，增强在线隐私保护。`
    },
    {
      question: `如何选择最适合的${title.includes("美国") ? "" : "美国"}VPN服务？`,
      answer: `选择${title.includes("美国") ? "" : "美国"}VPN服务时，应关注以下方面：服务器数量和分布位置、加密协议和安全性、无日志政策、连接速度和稳定性、设备兼容性、价格和性价比、客户支持质量。建议先试用免费版本或利用退款保证期测试服务。`
    },
    {
      question: `${title}是否会影响网络速度？`,
      answer: `使用${title.includes("美国") ? "" : "美国"}VPN确实可能会对网络速度产生一定影响，这主要取决于VPN服务器的距离、服务器负载和加密协议的选择。优质的${title.includes("美国") ? "" : "美国"}VPN服务提供商通常通过优化服务器网络、使用最新协议（如WireGuard）来最小化速度损失，大多数情况下用户几乎感觉不到明显的速度下降。`
    },
    {
      question: `免费${title.includes("美国") ? "" : "美国"}VPN和付费服务有什么区别？`,
      answer: `免费${title.includes("美国") ? "" : "美国"}VPN通常存在速度限制、数据流量限制、服务器选择有限、可能收集用户数据用于商业目的等问题。付费服务则提供无限制流量、更多服务器选择、更强的安全性和隐私保护、专业客户支持等优势。对于需要稳定、安全服务的用户，付费服务是更好的选择。`
    },
    {
      question: `${title}是否合法使用？`,
      answer: `在大多数国家，使用${title.includes("美国") ? "" : "美国"}VPN本身是合法的，但具体使用方式需要遵守当地法律法规。例如，使用VPN访问受版权保护的内容可能违反服务条款。建议用户了解所在地区的相关法律，并仅将VPN用于合法目的，如保护隐私和网络安全。`
    }
  ];
  
  const selectedFaq = faqQuestions
    .sort(() => Math.random() - 0.5)
    .slice(0, 3 + Math.floor(Math.random() * 3)); // 3-5 个问题
  
  const content = `${intro}\n\n${bodySections}\n\n${conclusion}`;
  
  const frontmatter = {
    title: title,
    description: `深入了解${title}，包括选择指南、功能特点、价格对比和安全分析，帮助您找到最适合的${title.includes("美国") ? "" : "美国"}VPN服务。`,
    keywords: keyword.toLowerCase(),
    pubDate: pubDate,
    faq: selectedFaq
  };
  
  const markdown = `---
title: "${title}"
description: "${frontmatter.description}"
keywords: "${frontmatter.keywords}"
pubDate: "${pubDate}"
faq:
${selectedFaq.map(f => `  - question: "${f.question}"\n    answer: "${f.answer}"`).join("\n")}
---

${content}
`;
  
  return { slug, markdown };
}

// 50 个美国 VPN 相关长尾关键词
const keywords = [
  "best vpn for usa streaming",
  "cheap vpn usa reddit",
  "fastest vpn usa servers",
  "usa vpn for netflix",
  "best vpn usa 2025",
  "free vpn usa no credit card",
  "usa vpn for gaming",
  "best vpn usa privacy",
  "usa vpn for torrenting",
  "cheap vpn usa monthly",
  "best vpn usa wireguard",
  "usa vpn for hulu",
  "best vpn usa speed",
  "usa vpn for disney plus",
  "best vpn usa security",
  "usa vpn for streaming",
  "best vpn usa price",
  "usa vpn for firestick",
  "best vpn usa review",
  "usa vpn for iphone",
  "best vpn usa android",
  "usa vpn for windows",
  "best vpn usa mac",
  "usa vpn for router",
  "best vpn usa no logs",
  "usa vpn for business",
  "best vpn usa customer service",
  "usa vpn for multiple devices",
  "best vpn usa kill switch",
  "usa vpn for dns leak protection",
  "best vpn usa encryption",
  "usa vpn for split tunneling",
  "best vpn usa server locations",
  "usa vpn for p2p",
  "best vpn usa unlimited bandwidth",
  "usa vpn for bypass geo restrictions",
  "best vpn usa money back guarantee",
  "usa vpn for 24/7 support",
  "best vpn usa easy setup",
  "usa vpn for beginners",
  "best vpn usa advanced features",
  "usa vpn for streaming 4k",
  "best vpn usa low latency",
  "usa vpn for online banking",
  "best vpn usa public wifi",
  "usa vpn for remote work",
  "best vpn usa travel",
  "usa vpn for china",
  "best vpn usa residential ip",
  "usa vpn for dedicated ip"
];

// 生成对应的中文标题
const titles = [
  "最佳美国VPN流媒体服务",
  "便宜美国VPN推荐",
  "最快美国VPN服务器",
  "美国VPN看Netflix",
  "2025最佳美国VPN",
  "免费美国VPN无需信用卡",
  "美国VPN游戏加速",
  "最佳美国VPN隐私保护",
  "美国VPN下载种子",
  "便宜美国VPN月付",
  "最佳美国VPN WireGuard协议",
  "美国VPN看Hulu",
  "最佳美国VPN速度",
  "美国VPN看Disney Plus",
  "最佳美国VPN安全性",
  "美国VPN流媒体服务",
  "最佳美国VPN价格",
  "美国VPN Firestick",
  "最佳美国VPN评测",
  "美国VPN iPhone版",
  "最佳美国VPN安卓版",
  "美国VPN Windows版",
  "最佳美国VPN Mac版",
  "美国VPN路由器配置",
  "最佳美国VPN无日志",
  "美国VPN企业版",
  "最佳美国VPN客服",
  "美国VPN多设备",
  "最佳美国VPN断网保护",
  "美国VPN DNS泄露防护",
  "最佳美国VPN加密",
  "美国VPN分流功能",
  "最佳美国VPN服务器位置",
  "美国VPN P2P下载",
  "最佳美国VPN无限流量",
  "美国VPN绕过地理限制",
  "最佳美国VPN退款保证",
  "美国VPN 24/7支持",
  "最佳美国VPN简单设置",
  "美国VPN新手指南",
  "最佳美国VPN高级功能",
  "美国VPN 4K流媒体",
  "最佳美国VPN低延迟",
  "美国VPN网上银行",
  "最佳美国VPN公共WiFi",
  "美国VPN远程办公",
  "最佳美国VPN旅行",
  "美国VPN中国使用",
  "最佳美国VPN住宅IP",
  "美国VPN专用IP"
];

console.log(`开始生成 ${keywords.length} 篇文章...`);

let successCount = 0;
let errorCount = 0;

keywords.forEach((keyword, index) => {
  try {
    const { slug, markdown } = generateArticle(keyword, titles[index]);
    const filePath = join(postsDir, `${slug}.md`);
    writeFileSync(filePath, markdown, "utf-8");
    successCount++;
    console.log(`[${index + 1}/${keywords.length}] ✓ ${slug}.md`);
  } catch (error) {
    errorCount++;
    console.error(`[${index + 1}/${keywords.length}] ✗ 生成失败: ${keyword}`, error.message);
  }
});

console.log(`\n完成！成功: ${successCount}, 失败: ${errorCount}`);
