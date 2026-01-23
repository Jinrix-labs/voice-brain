# Vercel Deployment Guide ▲

This guide will help you deploy both the frontend and backend to Vercel.

## Prerequisites

- GitHub account (your code is already pushed)
- Vercel account (sign up at <https://vercel.com>)

## Overview

Vercel supports monorepos, but for this setup, we'll deploy the backend and frontend as **separate Vercel projects**. This gives you:
- Independent deployments
- Separate URLs for frontend and backend
- Better scaling and management

## Step 1: Deploy Backend

1. Go to <https://vercel.com> and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository: `Jinrix-labs/voice-brain`
4. **Configure the project:**
   - **Framework Preset:** Other
   - **Root Directory:** `backend`
   - **Build Command:** `npm run build` (or leave empty, Vercel will auto-detect)
   - **Output Directory:** Leave empty (not needed for serverless functions)
   - **Install Command:** `npm install`
5. Click **"Deploy"**

### Backend Environment Variables

Before deploying (or after), add these in Vercel dashboard → **Settings** → **Environment Variables**:

```
FIREBASE_PROJECT_ID=your_firebase_project_id
GOOGLE_APPLICATION_CREDENTIALS={"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}
```

**For Firebase credentials:**

1. Open your `service-account.json` file locally
2. Copy the **entire JSON content** (all of it, including the braces)
3. Paste it as the value for `GOOGLE_APPLICATION_CREDENTIALS` in Vercel
4. The code will automatically detect it's a JSON string and parse it correctly

**Note:** Vercel automatically sets `PORT` and `VERCEL=1`, so you don't need to set those.

## Step 2: Deploy Frontend

1. In Vercel dashboard, click **"Add New..."** → **"Project"** again
2. Import the same GitHub repository: `Jinrix-labs/voice-brain`
3. **Configure the project:**
   - **Framework Preset:** Vite
   - **Root Directory:** `web`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)
   - **Install Command:** `npm install`
4. Click **"Deploy"**

### Frontend Environment Variables

Add these in Vercel dashboard → **Settings** → **Environment Variables**:

```
VITE_ELEVENLABS_API_KEY=sk_your_api_key_here
VITE_ELEVENLABS_AGENT_ID=agent_your_agent_id_here
VITE_API_BASE_URL=https://your-backend-project.vercel.app
```

**Important:** 
- Replace `VITE_API_BASE_URL` with your actual backend Vercel URL (you'll get this after deploying the backend)
- After setting `VITE_API_BASE_URL`, you'll need to **redeploy** the frontend for the change to take effect

## Step 3: Get Your URLs

1. After deployment, Vercel will give you URLs like:
   - Backend: `https://your-backend-project.vercel.app`
   - Frontend: `https://your-frontend-project.vercel.app`

2. **Update your ElevenLabs agent:**
   - Go to <https://elevenlabs.io/app/conversational-ai>
   - Edit your agent
   - Update tool endpoints to use your Vercel backend URL:
     - `https://your-backend-url.vercel.app/tool/save_memory`
     - `https://your-backend-url.vercel.app/tool/memory/save`
     - `https://your-backend-url.vercel.app/tool/reminder/create`

3. **Update frontend environment variable:**
   - In Vercel, go to your frontend project
   - **Settings** → **Environment Variables**
   - Update `VITE_API_BASE_URL` to your backend URL
   - Go to **Deployments** tab and click **"Redeploy"** (or push a new commit)

## Step 4: Custom Domains (Optional)

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Vercel will provide DNS records to configure

## Troubleshooting

### Backend returns 404 errors

**This is usually a configuration issue. Check:**

1. **Root Directory Setting:**
   - Go to your Vercel backend project → **Settings** → **General**
   - Verify **Root Directory** is set to `backend` (not empty, not the repo root)
   - If it's wrong, update it and redeploy

2. **Check Build Logs:**
   - In Vercel dashboard, go to your deployment
   - Check the **Build Logs** to see if `vercel.json` was found
   - Look for any errors about file paths

3. **Test the Root Endpoint:**
   - Try accessing: `https://your-backend-url.vercel.app/`
   - This should return `{"status":"backend alive"}`
   - If this works, the issue is with specific routes

4. **Check Function Logs:**
   - In Vercel dashboard → **Functions** tab
   - Check if `src/index.ts` appears as a function
   - Look at the **Runtime Logs** for any errors

5. **Verify vercel.json Location:**
   - Make sure `backend/vercel.json` exists (not in root)
   - The file should be in the same directory as `package.json`

### Backend won't start / 500 errors

- Check that Firebase credentials are correct in environment variables
- Verify `FIREBASE_PROJECT_ID` is set
- Check Vercel function logs in the dashboard
- Ensure `GOOGLE_APPLICATION_CREDENTIALS` is valid JSON (entire service account file as string)

### Frontend can't connect to backend

- Verify `VITE_API_BASE_URL` is set correctly (must start with `https://`)
- Make sure backend is deployed and running
- Check CORS settings (already enabled in backend)
- **Important:** After changing `VITE_API_BASE_URL`, you must redeploy the frontend!

### Build fails

**Backend:**
- Verify `vercel.json` exists in `backend/` directory
- Check that TypeScript compiles (`npm run build` works locally)
- Ensure all dependencies are in `package.json`

**Frontend:**
- Verify `vercel.json` exists in `web/` directory
- Check that Vite build works locally (`npm run build` in `web/` directory)
- Ensure all dependencies are in `package.json`

### CORS errors

The backend already has CORS enabled. If you still see CORS errors:
- Verify the backend URL in `VITE_API_BASE_URL` is correct
- Check that the backend is actually deployed and accessible
- Make sure you're using `https://` URLs, not `http://`

## Environment Variables Summary

### Backend

- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `GOOGLE_APPLICATION_CREDENTIALS` - Firebase service account JSON (as string)
- `VERCEL` - Automatically set by Vercel (don't set manually)
- `PORT` - Automatically set by Vercel (don't set manually)

### Frontend

- `VITE_ELEVENLABS_API_KEY` - Your ElevenLabs API key
- `VITE_ELEVENLABS_AGENT_ID` - Your ElevenLabs agent ID
- `VITE_API_BASE_URL` - Your backend Vercel URL (e.g., `https://your-backend.vercel.app`)

## Quick Deploy Commands

If you prefer Vercel CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy backend
cd backend
vercel

# Deploy frontend
cd ../web
vercel
```

For production deployments:

```bash
# Deploy backend to production
cd backend
vercel --prod

# Deploy frontend to production
cd ../web
vercel --prod
```

## Monorepo Alternative (Advanced)

If you want to deploy both as a single project, you can use Vercel's monorepo support:

1. Create a root `vercel.json` with multiple builds
2. Configure rewrites to route `/api/*` to backend and everything else to frontend
3. This is more complex but gives you a single domain

For most use cases, separate projects (as described above) is recommended.

## 🎉 Done

Your app should now be live on Vercel! Visit your frontend URL to test it out.

## Differences from Railway

- **Separate projects:** Backend and frontend are separate Vercel projects (better for scaling)
- **Automatic HTTPS:** Vercel provides HTTPS automatically
- **Serverless functions:** Backend runs as serverless functions (auto-scaling)
- **No port configuration:** Vercel handles ports automatically
- **Better TypeScript support:** Vercel handles TypeScript compilation automatically

