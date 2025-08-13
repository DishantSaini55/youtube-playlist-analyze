# 🚀 Deployment Guide - YouTube Playlist Analyzer

## Quick Deploy Options

### Option 1: Render (Recommended - Free)
1. **Setup Git Repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Create GitHub Repository:**
   - Go to [GitHub](https://github.com) and create a new repository
   - Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy on Render:**
   - Go to [Render.com](https://render.com)
   - Sign up with GitHub
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Use these settings:
     - **Build Command:** `cd frontend && npm install && npm run build && cd ../backend && npm install`
     - **Start Command:** `cd backend && npm start`
     - **Environment Variables:**
       - `NODE_ENV`: `production`
       - `YOUTUBE_API_KEY`: Your YouTube API key

### Option 2: Vercel (Frontend) + Railway (Backend)
1. **Frontend on Vercel:**
   - Go to [Vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set build command: `cd frontend && npm run build`
   - Set output directory: `frontend/build`

2. **Backend on Railway:**
   - Go to [Railway.app](https://railway.app)
   - Deploy from GitHub
   - Add environment variables

### Option 3: Heroku
1. **Install Heroku CLI**
2. **Deploy:**
   ```bash
   heroku create your-app-name
   heroku config:set YOUTUBE_API_KEY=your_api_key_here
   heroku config:set NODE_ENV=production
   git push heroku main
   ```

## 🔑 Required Environment Variables

Make sure to set these in your hosting platform:
- `YOUTUBE_API_KEY`: Your YouTube Data API v3 key
- `NODE_ENV`: `production`
- `PORT`: Usually auto-set by hosting platform

## 📝 Getting YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Restrict the key to YouTube Data API v3 (recommended)

## 🌐 After Deployment

Your live website will be available at:
- **Render:** `https://your-app-name.onrender.com`
- **Vercel:** `https://your-app-name.vercel.app`
- **Heroku:** `https://your-app-name.herokuapp.com`

## 🔧 Local Development

```bash
# Install dependencies
npm run install-deps

# Start development servers
npm run dev

# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```
