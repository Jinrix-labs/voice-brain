# Vercel 404 Troubleshooting Guide

If you're getting a 404 error on Vercel, follow these steps:

## Step 1: Verify Root Directory

**CRITICAL:** In your Vercel project settings:

1. Go to **Settings** → **General**
2. Find **Root Directory**
3. Make sure it's set to: `backend` (exactly, no trailing slash)
4. If it was wrong, **save** and **redeploy**

## Step 2: Check Build Logs

1. Go to your deployment in Vercel dashboard
2. Click on the deployment
3. Check **Build Logs**:
   - Look for errors about `vercel.json`
   - Verify it found `src/index.ts`
   - Check for TypeScript compilation errors

## Step 3: Check Function Logs

1. In Vercel dashboard → your project
2. Go to **Functions** tab
3. You should see `src/index.ts` listed as a function
4. If it's not there, the build didn't create it correctly
5. Check **Runtime Logs** for any errors

## Step 4: Test the Root Endpoint

Try accessing: `https://your-backend-url.vercel.app/`

This should return: `{"status":"backend alive"}`

If this works, your backend is running but specific routes might have issues.

## Step 5: Verify File Structure

Make sure these files exist in your repo:

```
backend/
  ├── vercel.json          ← Must exist
  ├── package.json         ← Must exist
  ├── tsconfig.json        ← Must exist
  └── src/
      └── index.ts         ← Must exist
```

## Step 6: Check Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Verify:
   - `FIREBASE_PROJECT_ID` is set
   - `GOOGLE_APPLICATION_CREDENTIALS` is set (full JSON string)

## Common Issues

### Issue: "Function not found"
**Solution:** Root Directory is not set to `backend`

### Issue: "Cannot find module"
**Solution:** Dependencies not installed - check Build Logs for npm install errors

### Issue: "TypeScript compilation failed"
**Solution:** Check tsconfig.json and ensure all dependencies are in package.json

### Issue: Routes return 404 but root works
**Solution:** Check that routes are properly mounted in src/index.ts

## Alternative: Use API Directory (if above doesn't work)

If the current setup still doesn't work, we can try using Vercel's `api/` directory structure:

1. Create `backend/api/index.ts` that imports and exports the app
2. Update `vercel.json` to use rewrites to `/api/index`

Let me know if you want to try this approach.
