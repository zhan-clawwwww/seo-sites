#!/usr/bin/env pwsh

# 为3月31日的文章添加YAML frontmatter

$sites = @(
    @{Name="ai"; Title="The Future of AI in Scientific Discovery: Accelerating Breakthroughs Beyond Human Limits"; Category="Artificial Intelligence"; Tags=@("AI", "Scientific Discovery", "Machine Learning", "Research", "Breakthroughs")},
    @{Name="apple"; Title="Apple's AR Glasses Ecosystem Revolution: Transforming How We See and Interact with the World"; Category="Apple Devices"; Tags=@("Apple", "AR Glasses", "Augmented Reality", "Vision Pro", "Ecosystem")},
    @{Name="openclaw"; Title="The Future of Local AI Assistants: Privacy, Personalization, and Planetary-Scale Processing"; Category="Open Source AI"; Tags=@("OpenClaw", "AI Assistants", "Privacy", "Local AI", "Personalization")},
    @{Name="site-a"; Title="The Evolution of SEO in the AI Era: From Keywords to Contextual Understanding"; Category="SEO & Web Development"; Tags=@("SEO", "Search Engine Optimization", "AI", "Content Strategy", "Digital Marketing")},
    @{Name="streaming"; Title="The Future of Interactive Streaming: From Passive Viewing to Participatory Entertainment"; Category="Streaming Entertainment"; Tags=@("Streaming", "Interactive", "Entertainment", "Platforms", "Content")},
    @{Name="tesla"; Title="Tesla's Energy Ecosystem Revolution: Beyond Electric Vehicles to a Comprehensive Sustainable Energy Platform"; Category="Electric Vehicles"; Tags=@("Tesla", "Electric Vehicles", "Energy", "Sustainability", "Innovation")},
    @{Name="vpn-usa"; Title="The Future of Digital Privacy in an AI-Driven World: Beyond VPNs to Comprehensive Privacy Ecosystems"; Category="Digital Privacy"; Tags=@("VPN", "Privacy", "Security", "Encryption", "Data Protection")},
    @{Name="web3"; Title="The Convergence of AI and Web3: Creating Decentralized Intelligent Systems"; Category="Web3 & Blockchain"; Tags=@("Web3", "Blockchain", "AI", "Decentralization", "Cryptocurrency")}
)

foreach ($site in $sites) {
    $filename = "sites\$($site.Name)\posts\$($site.Name)-2026-03-31-*.md"
    $files = Get-ChildItem -Path $filename
    
    if ($files.Count -eq 0) {
        Write-Host "未找到文件: $filename" -ForegroundColor Yellow
        continue
    }
    
    foreach ($file in $files) {
        Write-Host "处理: $($file.Name)" -ForegroundColor Cyan
        
        $content = Get-Content $file.FullName -Raw
        
        # 检查是否已经有frontmatter
        if ($content -match '^---\s*\n[\s\S]*?\n---\s*\n') {
            Write-Host "  已有frontmatter，跳过" -ForegroundColor Green
            continue
        }
        
        # 提取第一行作为标题（去掉#）
        $firstLine = ($content -split '\n')[0]
        $title = $firstLine -replace '^#\s*', ''
        
        # 提取前3行作为摘要
        $lines = $content -split '\n'
        $excerpt = ""
        for ($i = 1; $i -lt [Math]::Min(4, $lines.Count); $i++) {
            $line = $lines[$i].Trim()
            if ($line -ne '') {
                $excerpt += $line + " "
            }
        }
        $excerpt = $excerpt.Trim()
        if ($excerpt.Length -gt 200) {
            $excerpt = $excerpt.Substring(0, 197) + "..."
        }
        
        # 创建frontmatter
        $frontmatter = @"
---
title: "$title"
date: 2026-03-31
author: "SEO Content Team"
category: "$($site.Category)"
tags: [$($site.Tags | ForEach-Object { '"' + $_ + '"' } | Join-String ', ')]
excerpt: "$excerpt"
---

"@
        
        # 替换内容
        $newContent = $frontmatter + $content
        
        # 保存文件
        Set-Content -Path $file.FullName -Value $newContent -Encoding UTF8
        
        Write-Host "  已添加frontmatter" -ForegroundColor Green
    }
}

Write-Host "`n完成！所有文章已更新frontmatter。" -ForegroundColor Green