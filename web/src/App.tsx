import { useState } from "react";
import { PersonaSelector } from "./components/PersonaSelector";
import { VoiceButton } from "./components/VoiceButton";
import { type PersonaId } from "./personas";

function App() {
  const [persona, setPersona] = useState<PersonaId>("anime");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, #fdf2ff 0, #f4f4ff 40%, #ffffff 100%)",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          width: "100%",
          background: "white",
          borderRadius: "24px",
          padding: "1.5rem",
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ fontSize: "1.4rem", marginBottom: "0.25rem" }}>
          Jinrix Voice Brain
        </h1>
        <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1rem" }}>
          Talk to your AI persona. It remembers your ideas, creates reminders,
          and talks back with personality.
        </p>

        <PersonaSelector selected={persona} onChange={setPersona} />

        <div style={{ display: "flex", justifyContent: "center" }}>
          <VoiceButton persona={persona} />
        </div>

        <p
          style={{
            fontSize: "0.8rem",
            color: "#999",
            marginTop: "1.25rem",
            textAlign: "center",
          }}
        >
          Click to start, click again to stop. On mobile, hold to talk:
          <br />
          <em>
            "Remember this idea…" or "Remind me tonight at 8 to plug in my
            Tesla."
          </em>
        </p>
      </div>
    </div>
  );
}

export default App;

