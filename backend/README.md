# Jinrix Voice Brain - Backend

Express + TypeScript backend with Firestore for storing memories and reminders.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase (Optional for MVP)

The backend will run without Firebase, but memories won't be saved.

**To enable Firebase:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Go to **Project Settings** → **Service Accounts**
4. Click **Generate New Private Key**
5. Save the JSON file as `backend/service-account.json`
6. Copy your **Project ID** from Firebase console

### 3. Create `.env` File

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=4000
GOOGLE_APPLICATION_CREDENTIALS=./service-account.json
FIREBASE_PROJECT_ID=your_project_id_here
```

### 4. Start the Server

```bash
npm start
```

Or for development:

```bash
npm run dev
```

Backend will run on http://localhost:4000

## 📡 API Endpoints

### Memory Endpoints

#### `POST /tool/memory/save`
Save a memory.

**Request:**
```json
{
  "userId": "user123",
  "text": "Remember to build the demo",
  "persona": "anime",
  "tags": ["demo", "hackathon"]
}
```

**Response:**
```json
{
  "success": true,
  "memoryId": "abc123"
}
```

#### `POST /tool/memory/search`
Search memories by keyword.

**Request:**
```json
{
  "userId": "user123",
  "query": "demo"
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "abc123",
      "text": "Remember to build the demo",
      "persona": "anime",
      "createdAt": "..."
    }
  ]
}
```

### Reminder Endpoints

#### `POST /tool/reminder/create`
Create a reminder.

**Request:**
```json
{
  "userId": "user123",
  "text": "Plug in Tesla",
  "dueAt": "2024-12-30T20:00:00Z",
  "persona": "emo"
}
```

**Response:**
```json
{
  "success": true,
  "reminderId": "xyz789"
}
```

#### `GET /tool/reminder/upcoming?userId=user123`
Get upcoming reminders.

**Response:**
```json
{
  "success": true,
  "reminders": [
    {
      "id": "xyz789",
      "text": "Plug in Tesla",
      "dueAt": "...",
      "status": "scheduled"
    }
  ],
  "now": "2024-12-30T12:00:00Z"
}
```

### Legacy Endpoint

#### `POST /tool/save_memory`
Legacy endpoint for backwards compatibility with existing ElevenLabs tool configs.

**Request:**
```json
{
  "text": "Remember this idea"
}
```

**Response:**
```json
{
  "success": true,
  "memoryId": "abc123"
}
```

## 🔧 ElevenLabs Tool Configuration

Add these tools to your ElevenLabs agent:

### 1. save_memory
- **Name:** `save_memory`
- **Description:** `Save an important idea or memory the user wants to remember.`
- **Parameters:**
  ```json
  {
    "type": "object",
    "properties": {
      "text": {
        "type": "string",
        "description": "The memory to save"
      }
    },
    "required": ["text"]
  }
  ```
- **Endpoint:** `POST http://localhost:4000/tool/save_memory`

### 2. search_memory
- **Name:** `search_memory`
- **Description:** `Search for a previously saved memory by keyword.`
- **Parameters:**
  ```json
  {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Search query to find memories"
      }
    },
    "required": ["query"]
  }
  ```
- **Endpoint:** `POST http://localhost:4000/tool/memory/search`

### 3. create_reminder
- **Name:** `create_reminder`
- **Description:** `Create a reminder for the user.`
- **Parameters:**
  ```json
  {
    "type": "object",
    "properties": {
      "text": {
        "type": "string",
        "description": "What to remind the user about"
      },
      "dueAt": {
        "type": "string",
        "description": "ISO 8601 date string for when the reminder is due (optional)"
      }
    },
    "required": ["text"]
  }
  ```
- **Endpoint:** `POST http://localhost:4000/tool/reminder/create`

### 4. get_upcoming_reminders
- **Name:** `get_upcoming_reminders`
- **Description:** `Get the user's upcoming reminders.`
- **Parameters:**
  ```json
  {
    "type": "object",
    "properties": {
      "userId": {
        "type": "string",
        "description": "User ID"
      }
    },
    "required": ["userId"]
  }
  ```
- **Endpoint:** `GET http://localhost:4000/tool/reminder/upcoming?userId={userId}`

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── index.ts              # Main server file
│   ├── routes/
│   │   ├── memory.ts         # Memory endpoints
│   │   └── reminder.ts       # Reminder endpoints
│   └── services/
│       ├── firestore.ts      # Firebase initialization
│       └── memoryService.ts  # Memory business logic
├── .env                      # Environment variables (not committed)
├── .env.example             # Example env file
├── service-account.json      # Firebase credentials (not committed)
└── package.json
```

## 🚀 Deploy to Vercel

1. **Push** the repo to GitHub (if not already).
2. In [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
3. Set **Root Directory** to `backend` (no trailing slash). Save.
4. **Build & dev:** Leave **Build Command** empty or `npm run build`. **Output Directory** can stay default. **Install Command:** `npm install`.
5. **Environment variables:** In Project → Settings → Environment Variables, add the same vars as in `.env` (e.g. `FIREBASE_PROJECT_ID`, `GOOGLE_APPLICATION_CREDENTIALS` as the full JSON string). Do **not** set `PORT`.
6. **Deploy.** Your backend URL will be like `https://your-project.vercel.app`.
7. **ElevenLabs:** In your agent’s tools, set the **Endpoint** URLs to your Vercel URL:
   - save_memory: `https://your-project.vercel.app/tool/save_memory` or `.../tool/memory/save`
   - create_reminder: `https://your-project.vercel.app/tool/reminder/create`

**How it works:** `vercel.json` rewrites all requests to `api/index.ts`, which exports the Express app from `src/index.ts`. The app handles `/`, `/tool/ping`, `/tool/save_memory`, `/tool/memory/*`, and `/tool/reminder/*`.

## ⚠️ Notes

- Backend will run without Firebase, but memories/reminders won't persist
- For production, use environment variables or a secrets manager
- The `userId` defaults to "default" for legacy endpoints
- Search is currently keyword-based (will upgrade to semantic search later)
