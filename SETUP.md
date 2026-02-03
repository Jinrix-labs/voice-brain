# Jinrix Voice Brain - Setup Guide

## 🎯 What You're Building

A voice-first Second Brain that:
- Listens to your voice
- Remembers your ideas
- Creates reminders
- Responds with different personalities (Anime, Emo, Gremlin, Archivist)

---

## 📋 Prerequisites

- Node.js installed
- ElevenLabs account with API access
- Chrome browser (for best microphone support)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Frontend
cd web
npm install

# Backend
cd ../backend
npm install
```

### 2. Configure Environment Variables

Create `web/.env`:

```env
VITE_ELEVENLABS_API_KEY=sk_your_api_key_here
VITE_ELEVENLABS_AGENT_ID=agent_your_agent_id_here
# Backend URL (local dev vs production). Used when the frontend calls the API.
VITE_API_BASE_URL=http://localhost:4000

# Optional: Different voices per persona (see VOICE_SETUP.md)
# VITE_VOICE_ID_ANIME=your_voice_id_here
# VITE_VOICE_ID_EMO=your_voice_id_here
# VITE_VOICE_ID_GREMLIN=your_voice_id_here
# VITE_VOICE_ID_ARCHIVIST=your_voice_id_here
```

### 3. Create ElevenLabs Agent

1. Go to https://elevenlabs.io/app/conversational-ai
2. Click **"Create Agent"**
3. Configure:
   - **Name:** Jinrix Voice Brain
   - **Voice:** Choose any voice you like
   - **System Prompt:** (Will be overridden by personas, but add a default)
   
4. **Enable Overrides** (Security tab):
   - ✅ System prompt
   - ✅ First message
   - ✅ Voice ID (optional)

5. **Add Tool** (Tools tab):
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
   - **Endpoint:** `http://localhost:4000/tool/save_memory` (use your Railway URL in production; see "Backend on Railway" below)
   - **Method:** POST

6. Copy the **Agent ID** from the URL or settings

### 4. Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
node index.js
```

**Terminal 2 - Frontend:**
```bash
cd web
npm run dev
```

### 5. Test It!

1. Open http://localhost:5173/
2. Click **"Hold to talk"**
3. Allow microphone permissions
4. Say: **"Remember this: Voice-first second brain for Jinrix Labs"**
5. Check backend terminal - you should see:
   ```
   🧠 MEMORY TOOL CALLED: { text: "Voice-first second brain for Jinrix Labs" }
   ```

---

## 🎭 Persona System

The app has 4 personas with different personalities:

### Soft Anime 🌸
- Gentle, upbeat, supportive
- Short playful phrasing
- No sarcasm

### Emo Nag 🖤
- Blunt, dry sarcasm
- Helpful but teasing
- Short responses

### Chaos Gremlin 😈
- Playful, chaotic, funny
- Still completes tasks
- Unpredictable energy

### Calm Archivist 📚
- Minimal, clear, organized
- Summarizes and confirms
- Professional tone

**Switching Personas:**
- Click any persona button at the top
- If connected, the session will restart with the new persona
- Each persona has a unique greeting and speaking style

---

## 🔧 Troubleshooting

### "Agent doesn't exist" error
- Make sure you copied the correct Agent ID from ElevenLabs
- Verify the agent exists in your account at https://elevenlabs.io/app/conversational-ai
- Run: `node test-single-agent.js YOUR_AGENT_ID` to verify

### "Authorization failed" error
- Check your API key has "Conversational AI" permissions
- Regenerate the API key if needed
- Make sure the key starts with `sk_`

### Microphone not working
- Allow microphone permissions in your browser
- Click the 🔒 icon in the address bar → Microphone → Allow
- Use Chrome for best compatibility

### Backend not receiving tool calls
- Make sure backend is running on port 4000
- Check that the tool endpoint is configured correctly in ElevenLabs
- Verify the agent has the `save_memory` tool added

---

## 🚂 Backend on Railway

When your backend is deployed on Railway:

1. **Railway env vars**  
   In the Railway project, add the same variables as in `backend/.env` (e.g. Firebase). Do **not** set `PORT`; Railway sets it for you.

2. **ElevenLabs tool webhooks**  
   The agent calls your backend when it uses the memory/reminder tools. Update the tool URLs in the ElevenLabs dashboard:
   - Open your agent → **Tools** (e.g. [ElevenLabs Conversational AI](https://elevenlabs.io/app/conversational-ai))
   - For **save_memory**: set **Endpoint** to  
     `https://YOUR-RAILWAY-APP.up.railway.app/tool/save_memory`
   - For **reminder** (if you added it): set **Endpoint** to  
     `https://YOUR-RAILWAY-APP.up.railway.app/tool/reminder`  
     (or the exact path your reminder tool uses)
   - Use your real Railway URL (e.g. `https://voice-brain-backend.up.railway.app`).

3. **Web app (optional)**  
   If the frontend ever calls the backend directly, set in `web/.env` (or your host’s env):
   ```env
   VITE_API_BASE_URL=https://YOUR-RAILWAY-APP.up.railway.app
   ```
   The app uses this via `src/config.ts` (`API_BASE_URL`).

---

## 📁 Project Structure

```
voice-brain/
├── web/                    # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx        # Main app component
│   │   ├── personas.ts    # Persona definitions
│   │   └── components/
│   │       ├── PersonaSelector.tsx
│   │       └── VoiceButton.tsx
│   └── .env               # Environment variables
│
├── backend/               # Express backend
│   └── index.js          # API server with tool endpoints
│
└── SETUP.md              # This file
```

---

## 🎉 Next Steps

1. ✅ Get voice connection working
2. ✅ Test persona switching
3. ✅ Verify tool calls reach backend
4. 🔄 Add database to store memories
5. 🔄 Add reminder scheduling
6. 🔄 Add memory retrieval/search
7. 🔄 Deploy to production

---

## 🆘 Need Help?

- Check browser console (F12) for errors
- Check backend terminal for tool call logs
- Verify all environment variables are set
- Make sure both servers are running

---

Built for hackathon speed 🚀

