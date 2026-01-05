# Voice Setup Guide - Different Voices Per Persona

## 🎯 Goal

Each persona should have a **different voice** that matches their personality:
- **Anime**: High-pitched, energetic, expressive
- **Emo**: Deep, slow, monotone
- **Gremlin**: Raspy, chaotic, energetic  
- **Archivist**: Professional, clear, balanced

## 📋 Step 1: Find Voice IDs

1. Go to [ElevenLabs Voice Library](https://elevenlabs.io/app/voices)
2. Browse voices and listen to samples
3. Pick 4 voices that match each persona's vibe

### Recommended Voices (examples):

**Anime** (high-energy, expressive):
- "Bella" - Young, energetic female
- "Rachel" - Friendly, upbeat
- "Domi" - Expressive, dynamic

**Emo** (deep, monotone):
- "Antoni" - Deep, smooth male
- "Arnold" - Deep, authoritative
- "Adam" - Balanced, clear

**Gremlin** (chaotic, raspy):
- "Bella" - Can be energetic
- "Domi" - Dynamic and expressive
- "Elli" - Playful, varied

**Archivist** (professional, clear):
- "Rachel" - Clear, professional
- "Antoni" - Balanced, smooth
- "Adam" - Professional, neutral

## 📋 Step 2: Get Voice IDs

1. Click on a voice you like
2. Look at the URL: `https://elevenlabs.io/app/voices/VOICE_ID_HERE`
3. Copy the Voice ID (it looks like: `pNInz6obpgDQGcFmaJgB`)

## 📋 Step 3: Add to .env

Add these to your `web/.env` file:

```env
# Voice IDs for each persona
VITE_VOICE_ID_ANIME=pNInz6obpgDQGcFmaJgB
VITE_VOICE_ID_EMO=EXAVITQu4vr4xnSDxMaL
VITE_VOICE_ID_GREMLIN=VR6AewLTigWG4xSOukaG
VITE_VOICE_ID_ARCHIVIST=TxGEqnHWrfWFTfGW9XjX
```

Replace with your actual voice IDs!

## 📋 Step 4: Configure Voice Settings in ElevenLabs

For advanced control (stability, similarity_boost, style), you'll need to configure these in your ElevenLabs agent settings:

1. Go to your agent: https://elevenlabs.io/app/conversational-ai
2. Click on your agent
3. Go to **"Conversation Config"** or **"TTS Settings"**
4. For each voice you want to use, you can set:
   - **Stability**: Lower = more emotion (Anime: 0.3, Emo: 0.85)
   - **Similarity Boost**: How close to original voice
   - **Style**: Higher = more acting (Anime: 0.5, Emo: 0.0)

**Note:** These settings are per-voice in the agent config, not per-conversation. The code will override `voiceId` and `speed` per persona, but stability/similarity_boost need to be set in the agent's voice settings.

## 🎯 Alternative: Use Different Agents Per Persona

If you want full control over all TTS settings per persona:

1. Create 4 separate agents in ElevenLabs
2. Configure each agent with:
   - Different voice
   - Different TTS settings (stability, speed, etc.)
   - Different system prompt
3. Update your `.env`:
   ```env
   VITE_AGENT_ID_ANIME=agent_xxx
   VITE_AGENT_ID_EMO=agent_yyy
   VITE_AGENT_ID_GREMLIN=agent_zzz
   VITE_AGENT_ID_ARCHIVIST=agent_www
   ```
4. Update the code to use different agent IDs per persona

## ✅ Test It

1. Restart your dev server: `npm run dev`
2. Switch between personas
3. Each persona should now have a different voice!

## 🎨 Current Implementation

The code currently:
- ✅ Overrides `voiceId` per persona (if set in .env)
- ✅ Overrides `speed` per persona (Anime: 1.1x, Emo: 0.9x, Gremlin: 1.2x, Archivist: 1.0x)
- ✅ Overrides `prompt` and `firstMessage` per persona
- ⚠️  Stability/similarity_boost need to be set in agent config (or use separate agents)

## 💡 Pro Tip

If you don't set voice IDs in `.env`, it will use your agent's default voice. This is fine for testing, but each persona will sound the same (just different prompts).

