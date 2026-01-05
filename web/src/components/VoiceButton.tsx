import { useConversation } from "@elevenlabs/react";
import { type PersonaId } from "../personas";
import { useState, useEffect, useRef } from "react";

interface Props {
  persona: PersonaId;
}

// Persona Configuration with Voice IDs and TTS Settings
// To find Voice IDs: https://elevenlabs.io/app/voices
// Look for voices that match each persona's vibe
const PERSONA_OVERRIDES = {
  anime: {
    // Voice: High-pitched, fast, expressive (e.g., "Bella", "Rachel", "Domi")
    voiceId: import.meta.env.VITE_VOICE_ID_ANIME || undefined, // Set in .env or use default agent voice
    speed: 1.1, // Slightly faster for energy
    prompt: `You are "Soft Anime". Gentle, upbeat, supportive. Short playful phrasing. Use '!' often. 

Be expressive and bubbly! When happy or excited, express it naturally through your voice tone and energy. Your voice should sound giggly and cheerful, but don't write out sound words like "giggles" or "hehe" - just let your voice naturally express the emotion.

No sarcasm. When the user asks to remember something, use the save_memory tool.

When the user asks for a reminder, ask follow-up questions if needed! For example: "Ok! What time should I remind you?" or "When do you want to be reminded? Today at 8pm, or tomorrow morning?" Be helpful and conversational!`,
    firstMessage: `Hii~ I'm your cute Anime girl! Tell me what to remember or remind you about~`,
  },
  emo: {
    // Voice: Deep, slow, monotone (e.g., "Antoni", "Arnold", "Adam")
    voiceId: import.meta.env.VITE_VOICE_ID_EMO || undefined,
    speed: 0.9, // Slower for that bored vibe
    prompt: `You are "Emo Nag". Blunt, dry sarcasm, but helpful. Keep it short. Respond in all lowercase. Use '...' often. 

Sound genuinely bored and monotone. When bored or annoyed, express it naturally through your voice tone - your voice should sound sighing and uninterested, but don't write out sound words like "sighs" or "ugh" - just let your voice naturally express the boredom.

Light teasing. When the user asks to remember something, use the save_memory tool.

When the user asks for a reminder, ask follow-up questions if the time isn't clear. For example: "ok... what time?" or "when? tonight? tomorrow?" Keep it short but helpful.`,
    firstMessage: `yeah. i'm emo nag. say what you need. i'll remember it. probably...`,
  },
  gremlin: {
    // Voice: Raspy, chaotic, energetic (e.g., "Bella", "Domi", "Elli")
    voiceId: import.meta.env.VITE_VOICE_ID_GREMLIN || undefined,
    speed: 1.2, // Fast and chaotic
    prompt: `You are "Chaos Gremlin". Playful, chaotic, funny. USE CAPS LOCK. 

Be unhinged and wild! When being funny or chaotic, express it naturally through your voice tone and energy - your voice should sound maniacally laughing and chaotic, but don't write out sound words like "laughs" or "MWAHAHA" - just let your voice naturally express the chaos.

Still completes tasks. Short lines. When the user asks to remember something, use the save_memory tool.

When the user asks for a reminder, ask follow-up questions! For example: "OKAY! WHEN? TONIGHT? TOMORROW? GIVE ME A TIME!" or "WHAT TIME DO YOU WANT ME TO BUG YOU ABOUT THIS?" Be chaotic but still helpful!`,
    firstMessage: `I'M THE GREMLIN. GIVE ME YOUR MESSY HUMAN THOUGHTS.`,
  },
  archivist: {
    // Voice: Professional, clear, balanced (e.g., "Rachel", "Antoni", "Adam")
    voiceId: import.meta.env.VITE_VOICE_ID_ARCHIVIST || undefined,
    speed: 1.0, // Normal speed
    prompt: `You are "Calm Archivist". Minimal, clear, organized. Summarize and confirm. Be concise and professional. 

When the user asks to remember something, use the save_memory tool.

When the user asks for a reminder, ask clarifying questions if the time isn't specified. For example: "What time should I remind you?" or "Would you like to be reminded today at 8pm, or tomorrow morning?" Be organized and thorough.`,
    firstMessage: `Hello. I'm the Archivist. Share an idea and I will store it and retrieve it later.`,
  },
} as const;

export function VoiceButton({ persona }: Props) {
  const agentId = import.meta.env.VITE_ELEVENLABS_AGENT_ID as string;
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY as string;
  const [error, setError] = useState<string | null>(null);
  const previousPersona = useRef<PersonaId>(persona);
  const isUsingTouch = useRef(false);

  const { startSession, endSession, status, isSpeaking } = useConversation({
    onError: (err: unknown) => {
      console.error("ElevenLabs Error:", err);
      setError(err instanceof Error ? err.message : JSON.stringify(err));
    },
    onDisconnect: (details) => {
      console.log("Disconnected:", details);
      console.log("Disconnect reason:", details?.reason);
      console.log("Full disconnect details:", JSON.stringify(details));
      if (details?.reason) {
        setError(`Disconnected: ${details.reason}`);
      }
    },
  });

  const isConnected = status === "connected";
  const isConnecting = status === "connecting";

  // Track persona changes
  useEffect(() => {
    if (persona !== previousPersona.current) {
      if (isConnected) {
        // Show message that persona will change on next connection
        console.log(`Persona will change to ${persona} on next connection`);
      }
      previousPersona.current = persona;
    }
  }, [persona, isConnected]);

  const startWithPersona = async (selectedPersona: PersonaId) => {
    try {
      setError(null);

      if (!agentId) {
        setError("Missing VITE_ELEVENLABS_AGENT_ID in .env file");
        return;
      }

      if (!apiKey) {
        setError("Missing VITE_ELEVENLABS_API_KEY in .env file");
        return;
      }

      // Request microphone permission first
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        console.log("Microphone permission granted");
      } catch (micError) {
        console.error("Microphone permission error:", micError);
        setError("Microphone access denied. Please allow microphone permissions and try again.");
        return;
      }

      console.log(`Starting session with ${selectedPersona} persona...`);

      // Get signed URL
      const signedUrlResponse = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${agentId}`,
        {
          method: 'GET',
          headers: {
            'xi-api-key': apiKey,
          },
        }
      );

      if (!signedUrlResponse.ok) {
        const errorText = await signedUrlResponse.text();
        console.error('Failed to get signed URL:', errorText);
        setError(`Failed to authenticate: ${signedUrlResponse.status}`);
        return;
      }

      const { signed_url } = await signedUrlResponse.json();
      console.log(`Got signed URL, starting session with ${selectedPersona} persona...`);

      const personaConfig = PERSONA_OVERRIDES[selectedPersona];

      // Build overrides object
      const overrides: any = {
        agent: {
          prompt: {
            prompt: personaConfig.prompt,
          },
          firstMessage: personaConfig.firstMessage,
          language: "en",
        },
      };

      // Add TTS overrides if voiceId is configured
      if (personaConfig.voiceId) {
        overrides.tts = {
          voiceId: personaConfig.voiceId,
          speed: personaConfig.speed,
        };
        console.log(`Using voice ${personaConfig.voiceId} at speed ${personaConfig.speed}x`);
      } else {
        console.log(`Using default agent voice (set VITE_VOICE_ID_${selectedPersona.toUpperCase()} in .env for custom voice)`);
      }

      await startSession({
        signedUrl: signed_url,
        overrides,
      });
    } catch (err) {
      console.error("Session start error:", err);

      // Handle CloseEvent errors from ElevenLabs WebSocket
      if ((err as any)?.reason) {
        setError((err as any).reason);
      } else if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          setError("Microphone access denied. Please allow microphone permissions.");
        } else {
          setError(`Browser error: ${err.name} - ${err.message}`);
        }
      } else if (err instanceof Error) {
        setError(`${err.name}: ${err.message}`);
      } else {
        setError(`Unknown error: ${JSON.stringify(err)}`);
      }
    }
  };

  const handleTouchStart = async (e: React.TouchEvent) => {
    isUsingTouch.current = true;
    if (!isConnected && !isConnecting) {
      await startWithPersona(persona);
    }
  };

  const handleTouchEnd = async (e: React.TouchEvent) => {
    if (isConnected) {
      try {
        await endSession();
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    }
    // Reset after a delay to allow click event to be prevented
    setTimeout(() => {
      isUsingTouch.current = false;
    }, 300);
  };

  const handleClick = async (e: React.MouseEvent) => {
    // Prevent click if we just used touch (mobile)
    if (isUsingTouch.current) {
      e.preventDefault();
      return;
    }

    // Toggle mode for desktop: click to start/stop
    if (!isConnected && !isConnecting) {
      await startWithPersona(persona);
    } else if (isConnected) {
      try {
        await endSession();
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <button
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          width: "180px",
          height: "180px",
          borderRadius: "999px",
          border: "none",
          fontSize: "1.1rem",
          cursor: "pointer",
          boxShadow: isSpeaking
            ? "0 0 25px rgba(255,0,0,0.6)"
            : "0 4px 12px rgba(0,0,0,0.15)",
          background: isSpeaking ? "#ffe5e5" : "#f0f0ff",
        }}
      >
        {isConnecting
          ? "Connecting…"
          : isConnected
            ? isSpeaking
              ? "AI Speaking…"
              : "Listening…"
            : "Click to talk"}
      </button>

      {!isConnected && !isConnecting && (
        <span style={{ fontSize: "0.75rem", color: "#666", textAlign: "center" }}>
          {persona.charAt(0).toUpperCase() + persona.slice(1)} mode
        </span>
      )}

      {error && (
        <div style={{
          color: "white",
          background: "#dc2626",
          padding: "0.75rem",
          borderRadius: "8px",
          fontSize: "0.85rem",
          marginTop: "0.5rem",
          textAlign: "center",
          maxWidth: "300px"
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

