# Railway Deployment Guide 🚂

This guide will help you deploy both the frontend and backend to Railway.

## Prerequisites

- GitHub account (your code is already pushed)
- Railway account (sign up at <https://railway.app>)

## Step 1: Create Railway Project

1. Go to <https://railway.app> and sign in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `Jinrix-labs/voice-brain`
5. Railway will detect your monorepo structure

## Step 2: Deploy Backend Service

1. In your Railway project, click **"New Service"**
2. Select **"GitHub Repo"** → Choose your repo
3. Railway will auto-detect the backend folder
4. **Configure the service:**
   - **Root Directory:** `backend`
   - **Builder:** Select **"Nixpacks"** (NOT Docker) - **THIS IS CRITICAL!**
   - **Build Command:** Leave empty (nixpacks.toml handles it)
   - **Start Command:** `npm start`

**⚠️ CRITICAL:** After creating the service, you MUST change the builder:
   1. Go to your service → **Settings** tab
   2. Scroll to **"Build"** section
   3. Change **"Builder"** from "Docker" to **"Nixpacks"**
   4. Save changes
   5. Redeploy the service

### Backend Environment Variables

Add these in Railway dashboard → Variables tab:

```
PORT=4000
FIREBASE_PROJECT_ID=your_firebase_project_id
GOOGLE_APPLICATION_CREDENTIALS={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
```

**For Firebase credentials:**

1. Open your `service-account.json` file locally
2. Copy the **entire JSON content** (all of it, including the braces)
3. Paste it as the value for `GOOGLE_APPLICATION_CREDENTIALS` in Railway
4. The code will automatically detect it's a JSON string and parse it correctly

**Note:** Railway will automatically set `PORT`, but you can override it if needed.

## Step 3: Deploy Frontend Service

1. Click **"New Service"** again
2. Select **"GitHub Repo"** → Choose your repo
3. **Configure the service:**
   - **Root Directory:** `web`
   - **Builder:** Select **"Nixpacks"** (NOT Docker) - **THIS IS CRITICAL!**
   - **Build Command:** Leave empty (nixpacks.toml handles it)
   - **Start Command:** `npx serve -s dist -l $PORT`

**⚠️ CRITICAL:** After creating the service, you MUST change the builder:
   1. Go to your service → **Settings** tab
   2. Scroll to **"Build"** section
   3. Change **"Builder"** from "Docker" to **"Nixpacks"**
   4. Save changes
   5. Redeploy the service

### Frontend Environment Variables

Add these in Railway dashboard → Variables tab:

```
VITE_ELEVENLABS_API_KEY=sk_your_api_key_here
VITE_ELEVENLABS_AGENT_ID=agent_your_agent_id_here
VITE_API_BASE_URL=https://your-backend-service.railway.app
```

**Important:** Replace `VITE_API_BASE_URL` with your actual backend Railway URL!

## Step 4: Get Your URLs

1. After deployment, Railway will give you URLs like:
   - Backend: `https://backend-production-xxxx.up.railway.app`
   - Frontend: `https://web-production-yyyy.up.railway.app`

2. **Update your ElevenLabs agent:**
   - Go to <https://elevenlabs.io/app/conversational-ai>
   - Edit your agent
   - Update tool endpoints to use your Railway backend URL:
     - `https://your-backend-url.railway.app/tool/save_memory`
     - `https://your-backend-url.railway.app/tool/memory/save`
     - `https://your-backend-url.railway.app/tool/reminder/create`

3. **Update frontend environment variable:**
   - In Railway, update `VITE_API_BASE_URL` to your backend URL
   - Redeploy the frontend service

## Step 5: Custom Domains (Optional)

1. In Railway dashboard, go to your service
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Railway will provide DNS records to configure

## Troubleshooting

### Backend won't start

- Check that `PORT` environment variable is set
- Verify Firebase credentials are correct
- Check Railway logs for errors

### Frontend can't connect to backend

- Verify `VITE_API_BASE_URL` is set correctly
- Make sure backend is deployed and running
- Check CORS settings (already enabled in backend)

### Build fails / "npm: command not found" error

**This error means Railway is using Docker instead of Nixpacks!**

**Fix:**
1. Go to your Railway service dashboard
2. Click **"Settings"** tab
3. Scroll down to **"Build"** section
4. Find **"Builder"** dropdown
5. Change it from **"Docker"** to **"Nixpacks"**
6. Click **"Save"**
7. Go to **"Deployments"** tab and click **"Redeploy"**

**Other checks:**
- Verify `nixpacks.toml` exists in your service root directory (`backend/` or `web/`)
- Check that all dependencies are in `package.json`
- Verify Node.js version (set in `nixpacks.toml`)

## Quick Deploy Commands

If you prefer Railway CLI:

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Deploy backend
cd backend
railway up

# Deploy frontend
cd ../web
railway up
```

## Environment Variables Summary

### Backend

- `PORT` - Server port (default: 4000, Railway sets this automatically)
- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `GOOGLE_APPLICATION_CREDENTIALS` - Firebase service account JSON (as string)

### Frontend

- `VITE_ELEVENLABS_API_KEY` - Your ElevenLabs API key
- `VITE_ELEVENLABS_AGENT_ID` - Your ElevenLabs agent ID
- `VITE_API_BASE_URL` - Your backend Railway URL

## 🎉 Done

Your app should now be live on Railway! Visit your frontend URL to test it out.
