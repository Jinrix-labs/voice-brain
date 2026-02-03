# Vercel Deployment Walkthrough

Step-by-step guide to get voice-brain running on Vercel. Do these in order.

---

## Part 0: Before You Start

**Checklist:**
- [ ] Code is pushed to GitHub
- [ ] You have a [Vercel account](https://vercel.com/signup) (free)
- [ ] `backend/service-account.json` exists (for Firebase)

---

## Part 1: Deploy the Backend

### Step 1.1 — Create the backend project

1. Go to **[vercel.com](https://vercel.com)** and sign in.
2. Click **"Add New..."** → **"Project"**.
3. Find **voice-brain** (or your repo name) and click **Import**.
4. On the **Configure Project** screen, **do not** click Deploy yet.

### Step 1.2 — Set Root Directory (important)

1. Find **Root Directory**.
2. Click **Edit**.
3. Type: `backend`
4. Press Enter or click **Continue**.

### Step 1.3 — Project settings

Leave most things as-is. Confirm:

| Setting | Value |
|--------|--------|
| **Framework Preset** | Other |
| **Root Directory** | `backend` |
| **Build Command** | (leave default or `npm run build`) |
| **Output Directory** | (leave empty) |

### Step 1.4 — Deploy once (without env vars)

1. Click **Deploy**.
2. Wait for the build to finish.
3. You’ll get a URL like:  
   `https://voice-brain-xxxx.vercel.app`  
   **Copy this URL** — this is your **backend URL**.

### Step 1.5 — Add backend environment variables

1. In your project, go to **Settings** → **Environment Variables**.
2. Add:

   **Variable 1**

   - **Name:** `FIREBASE_PROJECT_ID`
   - **Value:** `voice-brain` (or whatever your Firebase project ID is)
   - **Environment:** Production (and Preview if you use it)
   - **Save**

   **Variable 2**

   - **Name:** `GOOGLE_APPLICATION_CREDENTIALS`
   - **Value:** Open `backend/service-account.json`, copy the **entire** JSON (from `{` to `}`), and paste it here as one line.
   - **Environment:** Production (and Preview if you use it)
   - **Save**

3. After saving both, go to **Deployments**.
4. Open the **⋮** on the latest deployment → **Redeploy**.
5. Wait for the new deployment to finish.

### Step 1.6 — Test the backend

- Open: `https://your-backend-url.vercel.app/`
- You should see: `{"status":"backend alive"}`

If you see that, the backend is working. If you get 404, see **Troubleshooting** at the end.

---

## Part 2: Deploy the Frontend

### Step 2.1 — Create the frontend project

1. In Vercel, click **"Add New..."** → **"Project"** again.
2. Import the **same** repo: **voice-brain**.
3. On **Configure Project**, do not Deploy yet.

### Step 2.2 — Set Root Directory

1. **Root Directory** → **Edit**.
2. Type: `web`
3. **Continue**.

### Step 2.3 — Project settings

| Setting | Value |
|--------|--------|
| **Framework Preset** | Vite |
| **Root Directory** | `web` |
| **Build Command** | `npm run build` (usually auto-filled) |
| **Output Directory** | `dist` (usually auto-filled) |

### Step 2.4 — Add frontend environment variables (before first deploy)

1. Expand **Environment Variables**.
2. Add:

   | Name | Value |
   |-----|--------|
   | `VITE_ELEVENLABS_API_KEY` | your ElevenLabs API key |
   | `VITE_ELEVENLABS_AGENT_ID` | your ElevenLabs agent ID (e.g. `agent_5301kdczg3d3e0ssgkk88ta3xdyx`) |
   | `VITE_API_BASE_URL` | `https://your-backend-url.vercel.app` ← **use your real backend URL from Part 1, with `https://`** |

   Optional (for custom voices):

   - `VITE_VOICE_ID_ANIME`
   - `VITE_VOICE_ID_EMO`
   - `VITE_VOICE_ID_GREMLIN`
   - `VITE_VOICE_ID_ARCHIVIST`

3. **Deploy**.

### Step 2.5 — Test the frontend

- Open: `https://your-frontend-url.vercel.app`
- You should see the Voice Brain UI. Use it to test voice + backend.

---

## Part 3: Connect ElevenLabs to Your Backend

Your ElevenLabs agent must call your **live** backend URL, not localhost.

1. Go to [ElevenLabs → Conversational AI](https://elevenlabs.io/app/conversational-ai).
2. Open your agent → **Tools**.
3. Set the backend base URL to:  
   `https://your-backend-url.vercel.app`
4. Ensure the tool URLs use that base, e.g.:
   - `https://your-backend-url.vercel.app/tool/save_memory`
   - `https://your-backend-url.vercel.app/tool/memory/save`
   - `https://your-backend-url.vercel.app/tool/reminder/create`
5. Save the agent.

---

## Part 4: If You Change Something Later

- **Backend:** change code or env vars → **Deployments** → **Redeploy** (or push to GitHub if it’s connected).
- **Frontend:**  
  - If you change `VITE_API_BASE_URL` or any `VITE_*` → add/update in **Settings** → **Environment Variables**, then **Redeploy**.
- **ElevenLabs:** if you change the backend URL, update the tool URLs in the agent.

---

## Troubleshooting

### Backend: 404 on `https://your-backend.vercel.app/`

1. **Root Directory**  
   - **Settings** → **General** → **Root Directory** must be exactly `backend` (no slash, no typo). Save and **Redeploy**.

2. **Repo layout**  
   - There must be:  
     - `backend/vercel.json`  
     - `backend/api/index.ts`  
     - `backend/package.json`  
   - If you’re not sure, check on GitHub that `backend` is the folder name at the top level.

3. **Build / Functions**  
   - **Deployments** → latest deployment → **Building** / **Functions**.  
   - Look for errors. If `api/index` (or `api/index.ts`) doesn’t appear under Functions, the `api` setup may not have been used; fix Root Directory and redeploy.

### Backend: 500 or “backend alive” but tools fail

- **Settings** → **Environment Variables**:  
  - `FIREBASE_PROJECT_ID` set.  
  - `GOOGLE_APPLICATION_CREDENTIALS` = full JSON from `service-account.json` (one line, valid JSON).  
- **Deployments** → **Redeploy** after changing env vars.

### Frontend: can’t reach backend / CORS

- `VITE_API_BASE_URL` must be:  
  `https://your-backend-url.vercel.app`  
  (with `https://`, no trailing slash).
- Re-add or fix it in **Environment Variables**, then **Redeploy** the frontend.

### Frontend: build fails

- In the project, **Settings** → **General** → **Root Directory** = `web`.
- Check **Build Logs** for the exact error (e.g. missing `VITE_*` or npm error).

---

## Quick reference

| What | Where |
|------|-------|
| Backend URL | `https://<backend-project>.vercel.app` |
| Frontend URL | `https://<frontend-project>.vercel.app` |
| Backend Root Directory | `backend` |
| Frontend Root Directory | `web` |
| Backend env | `FIREBASE_PROJECT_ID`, `GOOGLE_APPLICATION_CREDENTIALS` |
| Frontend env | `VITE_ELEVENLABS_API_KEY`, `VITE_ELEVENLABS_AGENT_ID`, `VITE_API_BASE_URL` |

---

If you’re stuck on a specific step (e.g. “Step 1.2” or “404 on backend”), say which step and what you see, and we can narrow it down.
