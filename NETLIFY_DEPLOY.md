# 🚀 Netlify Deployment Guide

## Step-by-Step Deployment Instructions

### 1. **Get YouTube API Key**
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Create a new project or select existing one
- Enable YouTube Data API v3
- Create credentials (API Key)
- Copy your API key

### 2. **Deploy to Netlify**
1. **Go to [Netlify](https://netlify.com)**
2. **Drag and drop** this entire `youtube-playlist-analyzer` folder
3. **Wait for build to complete**

### 3. **Configure Environment Variables**
1. Go to **Site Settings** > **Environment Variables**
2. Add new variable:
   - **Key**: `YOUTUBE_API_KEY`
   - **Value**: Your YouTube API key from step 1
3. Click **Save**

### 4. **Redeploy**
1. Go to **Deploys** tab
2. Click **Trigger Deploy** > **Deploy site**
3. Wait for deployment to finish

### 5. **Test Your Site**
- Visit your Netlify URL
- Try analyzing a YouTube playlist
- Everything should work perfectly!

## 📁 What Gets Deployed
- ✅ React frontend (optimized build)
- ✅ Netlify Functions (serverless backend)
- ✅ API routing and CORS handling
- ✅ All your custom features

## 🔧 Technical Details
- **Frontend**: React app served from `/frontend/build`
- **Backend**: Netlify Functions at `/.netlify/functions/analyze`
- **Routing**: SPA routing handled automatically
- **CORS**: Pre-configured for web deployment

Your app will be fully functional with drag-and-drop deployment! 🎉
