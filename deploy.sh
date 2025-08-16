#!/bin/bash

# Rawgle Frontend Deployment Script
# Builds and deploys to Cloudflare Pages

set -e

echo "🚀 Building Rawgle Frontend..."
npm run build

echo "📦 Deploying to Cloudflare Pages..."
wrangler pages deploy dist --project-name=rawgle-frontend --commit-dirty=true

echo "✅ Deployment complete!"
echo ""
echo "🌐 Your site is live at the URL shown above"
echo ""
echo "🔄 To make future updates:"
echo "1. Edit src/App.jsx or other components"
echo "2. Run: ./deploy.sh"
echo "3. Your changes will be live instantly!"