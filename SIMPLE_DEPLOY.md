# 🚀 Simple Vercel Deployment Guide

## **Step 1: Deploy Backend API First**

1. **Create a new Vercel project for backend**:
   - Go to [vercel.com](https://vercel.com)
   - Click **"Add New"** → **"Project"**
   - Import your GitHub repository: `DishantSaini55/youtube-playlist-analyze`
   - **Root Directory**: Select `backend` folder
   - **Framework Preset**: Other
   - Add Environment Variable:
     - **Name**: `YOUTUBE_API_KEY`
     - **Value**: `AIzaSyABb8KAFgjIIfeyGI9LPn4rqWmTvrZJNeo`
   - Click **Deploy**

2. **Copy the backend URL** (e.g., `https://youtube-playlist-analyze-backend.vercel.app`)

## **Step 2: Update Frontend to Use Backend URL**

After backend deployment, update frontend with the actual backend URL and redeploy.

## **Step 3: Redeploy Frontend** 

Update your existing frontend deployment to connect to the new backend.

---

## **Alternative: Use a Free Backend Service**

If Vercel backend doesn't work, you can deploy backend to:
- **Railway** (easiest)
- **Render** (free tier)
- **Heroku** (if you have account)

Your frontend will work with any backend URL!
