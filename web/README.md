# Jinrix Voice Brain 🧠🎤

A voice-first Second Brain that turns your thoughts into memories and reminders with personality.

## Features

- 🎭 **4 AI Personas**: Soft Anime, Emo Nag, Chaos Gremlin, Calm Archivist
- 🎤 **Voice-First**: Hold to talk, AI responds with voice
- 🧠 **Memory Storage**: Remembers your ideas and retrieves them later
- ⏰ **Smart Reminders**: Create reminders with natural language
- 🔊 **ElevenLabs Integration**: Real-time voice conversation

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create `.env` file** with your ElevenLabs credentials:
   ```env
   VITE_ELEVENLABS_API_KEY=your_api_key_here
   VITE_ELEVENLABS_AGENT_ID=your_agent_id_here
   ```

   Get your API key: https://elevenlabs.io/app/settings/api-keys
   Create an agent: https://elevenlabs.io/app/conversational-ai

3. **Run the dev server**:
   ```bash
   npm run dev
   ```

## Usage

1. Select a persona (Anime, Emo, Gremlin, or Archivist)
2. Hold the button and speak
3. Try saying:
   - "Remember this idea about building a voice app..."
   - "Remind me tonight at 8 to plug in my Tesla"
   - "What was my idea about Jinrix Labs?"

## Tech Stack

- React + TypeScript
- Vite
- ElevenLabs Conversational AI
- Voice-first UX

## 2-Week MVP Goals

- ✅ Voice loop with persona switching
- 🔄 Memory storage + embeddings
- 🔄 Reminder scheduling
- 🔄 Retrieval with natural language

