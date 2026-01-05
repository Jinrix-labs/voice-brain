# 🚨 URGENT: Fix "Unable to generate build plan" Error

## The Problem

Railway is building from the **root directory** instead of `backend/` or `web/`. This is why you see files like `SETUP.md`, `railway.toml` in the error message.

## The Solution: Set Root Directory

### Step-by-Step Instructions:

1. **Go to your Railway service** (the one that's failing)
2. **Click the "Settings" tab** (gear icon or "Settings" in the sidebar)
3. **Scroll down to find "Source" section**
4. **Look for "Root Directory" field** - it might be empty or show `/`
5. **Type exactly:** `backend` (for backend service) or `web` (for frontend service)
   - ⚠️ **NO leading slash** - just `backend` or `web`
   - ⚠️ **NO trailing slash** - not `backend/` or `web/`
6. **Click "Save"** or "Update" button
7. **Go to "Deployments" tab**
8. **Click "Redeploy"** (or the three dots menu → Redeploy)

## If Root Directory Setting Doesn't Exist or Doesn't Work:

### Option 1: Delete and Recreate Service

1. Delete the current service
2. Create a new service from GitHub repo
3. **BEFORE clicking "Deploy"**, go to Settings
4. Set Root Directory to `backend` or `web`
5. Set Builder to "Nixpacks"
6. Then deploy

### Option 2: Use Railway CLI

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Set root directory for backend
cd backend
railway service
# This will prompt you to set root directory

# Or set it directly
railway variables set RAILWAY_SERVICE_ROOT=backend
```

## Verify It's Working

After setting Root Directory and redeploying, the build log should show:
- Files from `backend/` or `web/` directory
- `package.json` being found
- Nixpacks detecting Node.js project

If you still see root directory files in the error, the Root Directory setting isn't being applied.

## Still Not Working?

1. **Check Railway UI version** - Some older versions might not have Root Directory setting
2. **Try creating service from scratch** - Sometimes settings don't apply to existing services
3. **Contact Railway support** - They can help verify the Root Directory is set correctly

