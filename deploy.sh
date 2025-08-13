#!/bin/bash

echo "🚀 Deploying YouTube Playlist Analyzer..."

# Check if we have a YouTube API key
if [ -z "$YOUTUBE_API_KEY" ]; then
    echo "⚠️  Warning: YOUTUBE_API_KEY environment variable not set"
    echo "   You'll need to set this in your hosting platform"
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd frontend && npm install
cd ../backend && npm install
cd ..

# Build frontend
echo "🏗️  Building frontend..."
cd frontend && npm run build
cd ..

echo "✅ Build complete!"
echo "📋 Next steps:"
echo "   1. Set YOUTUBE_API_KEY environment variable"
echo "   2. Deploy to your hosting platform"
echo "   3. Your app will be live!"
