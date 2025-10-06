#!/bin/bash

# HealthBridge Vercel Deployment Setup Script

echo "🏥 HealthBridge - Vercel Deployment Setup"
echo "=========================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null
then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
else
    echo "✅ Vercel CLI already installed"
fi

echo ""
echo "🔐 Please login to Vercel..."
vercel login

echo ""
echo "📋 Project Information:"
echo "  Name: healthbridge-platform"
echo "  Framework: Vite + React"
echo "  Build Command: npm run build"
echo "  Output Directory: dist"
echo ""

read -p "🚀 Ready to deploy? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🚀 Deploying to Vercel..."
    vercel --prod
    
    echo ""
    echo "✅ Deployment Complete!"
    echo ""
    echo "📝 Next Steps:"
    echo "  1. Add environment variables in Vercel Dashboard"
    echo "  2. Update Firebase authorized domains"
    echo "  3. Test your deployment"
    echo ""
    echo "📖 See DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Deployment cancelled"
fi
