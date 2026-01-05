# Firebase Setup Guide

## 🎯 Quick Setup (5 minutes)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or select existing
3. Enter project name: `jinrix-voice-brain` (or any name)
4. Click **"Continue"** → **"Continue"** → **"Create project"**

### Step 2: Get Service Account Key

1. In Firebase Console, click the **gear icon** ⚙️ → **Project settings**
2. Go to **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** in the popup
5. A JSON file will download - **save it as `backend/service-account.json`**

### Step 3: Get Project ID

1. Still in Project Settings
2. Copy the **Project ID** (shown at the top, e.g., `jinrix-voice-brain-abc123`)

### Step 4: Configure Backend

1. Create `backend/.env` file:
   ```env
   PORT=4000
   GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
   FIREBASE_PROJECT_ID=your_project_id_here
   ```

2. Replace `your_project_id_here` with your actual Project ID

3. Make sure `service-account.json` is in the `backend/` folder

### Step 5: Restart Backend

```bash
cd backend
npm start
```

You should see:
```
✅ Firebase initialized successfully
🚀 Backend running on http://localhost:4000
```

## ✅ Verify It Works

Test the memory endpoint:

```bash
curl -X POST http://localhost:4000/tool/memory/save \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","text":"Testing Firebase"}'
```

You should see in the console:
```
🧠 MEMORY SAVED: { userId: 'test', text: 'Testing Firebase', ... }
```

## 🔒 Security Notes

- ✅ `service-account.json` is in `.gitignore` (won't be committed)
- ✅ `.env` is in `.gitignore` (won't be committed)
- ⚠️  Never commit these files to git!
- ⚠️  For production, use environment variables or secrets manager

## 🎉 Done!

Your backend now persists memories and reminders to Firestore!

