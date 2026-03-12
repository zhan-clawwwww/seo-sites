#!/usr/bin/env node
/**
 * 润色 vpn-usa 文章：替换重复的 AI 语气段落为简短、自然的表述
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(__dirname, "..", "sites", "vpn-usa", "posts");

// 章节标题 -> 简短替换内容
const sectionContent = {
  "如何设置VPN": "安装客户端后选美国服务器连接即可，多数支持一键连接。",
  "VPN安全性分析": "选 VPN 时看三点：AES-256 加密、无日志政策、kill switch。",
  "VPN价格对比": "月付约 $10，年付能省一半。注意续费价，很多首年便宜、续费会涨。",
  "如何选择最适合的VPN": "按用途选：看流媒体挑支持 Netflix 的，重隐私选无日志的，多设备用选支持多端口的。",
  "为什么选择VPN服务": "VPN 能加密流量、换 IP、访问受限内容。在美国用主要是隐私和流媒体。",
  "最佳VPN推荐": "主流有 NordVPN、ExpressVPN、Surfshark 等，都有美国节点。先试用再决定。",
  "VPN的核心功能": "加密、换 IP、跨区访问。核心就这三样。",
  "使用VPN的注意事项": "别用免费 VPN 干敏感的事。选有退款保证的，试用不满意就退。",
};

// 匹配重复的 6 段式 AI 块（首先、其次、此外、价格方面、最后）
const blockRegex =
  /[^\n]+的选择需要考虑多个因素。首先，服务器的地理位置和数量直接影响连接速度和稳定性。优质的VPN服务提供商通常在全球部署大量服务器，确保用户能够获得最佳的网络体验。\s*\n\n其次，加密技术和协议的选择至关重要。现代VPN服务多采用AES-256加密标准，配合WireGuard或OpenVPN等先进协议，能够有效保护用户数据安全。同时，无日志政策也是评估VPN服务的重要标准，确保您的在线活动不会被记录或追踪。\s*\n\n此外，VPN的兼容性也是需要考虑的因素。优秀的服务应该支持Windows、macOS、iOS、Android等主流操作系统，并提供浏览器扩展和路由器配置选项。对于需要同时保护多台设备的用户，多设备同时连接功能也是必不可少的。\s*\n\n价格方面，VPN服务的定价策略各不相同。虽然免费VPN看似诱人，但通常存在速度限制、数据流量限制或隐私风险。付费服务虽然需要一定成本，但能够提供更稳定、更安全的服务体验。建议用户根据自身需求选择合适的价格方案，通常长期订阅能够获得更优惠的价格。\s*\n\n最后，客户支持质量也是选择VPN服务时不可忽视的因素。专业的服务提供商应该提供7x24小时在线支持，包括实时聊天、邮件支持和详细的知识库，帮助用户解决使用过程中遇到的各种问题。/g;

const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".md"));
let modified = 0;

for (const file of files) {
  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, "utf8");

  let newContent = content;

  // 有重复段落时才做章节替换
  if (content.includes("首先，服务器的地理位置")) {
    const parts = content.split(/\n(?=## )/);
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part.startsWith("## ")) continue;
      const titleMatch = part.match(/^## ([^\n]+)\n\n/);
      if (!titleMatch) continue;
      const sectionTitle = titleMatch[1].trim();
      const replacement = sectionContent[sectionTitle] || "选 VPN 看服务器、加密、价格、客服。试用期多测几家再定。";
      if (part.includes("首先，服务器的地理位置") && part.includes("最后，客户支持质量")) {
        const newPart = part.replace(blockRegex, replacement);
        if (newPart !== part) parts[i] = newPart;
      }
    }
    newContent = parts.join("\n\n");
  }

  // 润色结论
  newContent = newContent.replace(
    /总的来说，[^。]+。[^。]+。建议用户在选择时进行充分调研，阅读用户评价，并利用免费试用期测试服务质量，最终找到最适合自己需求的解决方案。/g,
    "选 VPN 别冲动。先看评价，再用试用期实测，合适再续费。"
  );

  // 润色开头
  newContent = newContent.replace(
    /([^。\n]+)是当前网络用户关注的热点话题。随着网络安全和隐私保护意识的提升，越来越多的用户开始寻找可靠的VPN解决方案。本文将深入探讨[^。]+的各个方面，帮助您做出明智的选择。/,
    "$1，很多人用 VPN 就是为了这个。下面说说怎么选、怎么用。"
  );

  // 润色 frontmatter description
  newContent = newContent.replace(
    /description: "深入了解[^"]+，包括选择指南、功能特点、价格对比和安全分析，帮助您找到最适合的VPN服务。"/g,
    (m) => {
      const title = m.match(/深入了解([^，]+)，/)[1];
      return `description: "${title}：怎么选、怎么用。"`;
    }
  );

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent);
    modified++;
  }
}

console.log(`润色完成: ${modified} 篇文章已更新`);
