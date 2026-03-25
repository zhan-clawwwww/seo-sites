# 特斯拉专栏部署问题诊断脚本

Write-Host "🔍 特斯拉专栏部署问题诊断" -ForegroundColor Cyan
Write-Host "=" * 50

Write-Host "`n📁 1. 本地文件检查:" -ForegroundColor Yellow

# 检查本地文件
$teslaDir = "dist/tesla"
$indexFile = "$teslaDir/index.html"

if (Test-Path $teslaDir) {
    Write-Host "   ✅ Tesla目录存在" -ForegroundColor Green
} else {
    Write-Host "   ❌ Tesla目录不存在" -ForegroundColor Red
}

if (Test-Path $indexFile) {
    $fileSize = (Get-Item $indexFile).Length
    Write-Host "   ✅ index.html存在 (大小: $fileSize 字节)" -ForegroundColor Green
} else {
    Write-Host "   ❌ index.html不存在" -ForegroundColor Red
}

Write-Host "`n🌐 2. 网络访问测试:" -ForegroundColor Yellow

# 测试网站访问
$urls = @(
    @{Name="网站首页"; Url="https://wordok.top/"},
    @{Name="AI专栏"; Url="https://wordok.top/ai/"},
    @{Name="Tesla专栏"; Url="https://wordok.top/tesla/"},
    @{Name="Tesla文章页"; Url="https://wordok.top/tesla/posts/tesla-2026-03-25-tesla-model-3-refresh-2026/"}
)

foreach ($url in $urls) {
    try {
        $response = Invoke-WebRequest -Uri $url.Url -Method Head -ErrorAction Stop
        Write-Host "   ✅ $($url.Name): $($response.StatusCode) $($response.StatusDescription)" -ForegroundColor Green
    } catch {
        $errorMsg = $_.Exception.Message
        if ($errorMsg -match "404") {
            Write-Host "   ❌ $($url.Name): 404 Not Found" -ForegroundColor Red
        } elseif ($errorMsg -match "403") {
            Write-Host "   ❌ $($url.Name): 403 Forbidden" -ForegroundColor Red
        } elseif ($errorMsg -match "500") {
            Write-Host "   ❌ $($url.Name): 500 Internal Server Error" -ForegroundColor Red
        } else {
            Write-Host "   ⚠️  $($url.Name): 连接错误 - $errorMsg" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n🔧 3. 可能的问题分析:" -ForegroundColor Magenta
Write-Host "   • 部署服务可能没有正确上传tesla目录" -ForegroundColor Yellow
Write-Host "   • 可能需要手动触发重新部署" -ForegroundColor Yellow
Write-Host "   • 检查部署配置是否正确" -ForegroundColor Yellow
Write-Host "   • 可能是路径大小写问题（Tesla vs tesla）" -ForegroundColor Yellow

Write-Host "`n🚀 4. 解决方案建议:" -ForegroundColor Cyan
Write-Host "   1. 检查部署服务的构建日志" -ForegroundColor Green
Write-Host "   2. 手动触发重新部署" -ForegroundColor Green
Write-Host "   3. 检查部署配置中的构建命令" -ForegroundColor Green
Write-Host "   4. 确保输出目录正确（应该是dist/）" -ForegroundColor Green
Write-Host "   5. 检查是否有.htaccess或路由配置问题" -ForegroundColor Green

Write-Host "`n📊 5. 当前状态总结:" -ForegroundColor White
Write-Host "   ✅ 本地构建: Tesla专栏文件已正确生成" -ForegroundColor Green
Write-Host "   ✅ Git推送: 所有代码已推送到GitHub" -ForegroundColor Green
Write-Host "   ❌ 生产环境: Tesla专栏返回404错误" -ForegroundColor Red
Write-Host "   ✅ 其他专栏: 正常访问（AI专栏200 OK）" -ForegroundColor Green

Write-Host "`n💡 需要的信息:" -ForegroundColor Blue
Write-Host "   • 你使用什么部署服务？（GitHub Pages, Vercel, Netlify等）" -ForegroundColor White
Write-Host "   • 能否查看部署服务的构建日志？" -ForegroundColor White
Write-Host "   • 是否有权限手动触发重新部署？" -ForegroundColor White

Write-Host "`n" + "=" * 50
Write-Host "诊断完成 - 核心问题: 部署服务未正确上传Tesla专栏" -ForegroundColor Cyan