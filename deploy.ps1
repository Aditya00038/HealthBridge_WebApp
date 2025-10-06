# HealthBridge Vercel Deployment Setup Script (PowerShell)

Write-Host "🏥 HealthBridge - Vercel Deployment Setup" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
} else {
    Write-Host "✅ Vercel CLI already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔐 Please login to Vercel..." -ForegroundColor Yellow
vercel login

Write-Host ""
Write-Host "📋 Project Information:" -ForegroundColor Cyan
Write-Host "  Name: healthbridge-platform"
Write-Host "  Framework: Vite + React"
Write-Host "  Build Command: npm run build"
Write-Host "  Output Directory: dist"
Write-Host ""

$deploy = Read-Host "🚀 Ready to deploy? (y/n)"

if ($deploy -eq "y" -or $deploy -eq "Y") {
    Write-Host ""
    Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
    vercel --prod
    
    Write-Host ""
    Write-Host "✅ Deployment Complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next Steps:" -ForegroundColor Cyan
    Write-Host "  1. Add environment variables in Vercel Dashboard"
    Write-Host "  2. Update Firebase authorized domains"
    Write-Host "  3. Test your deployment"
    Write-Host ""
    Write-Host "📖 See DEPLOYMENT.md for detailed instructions" -ForegroundColor Cyan
} else {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
