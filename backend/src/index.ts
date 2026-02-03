import "dotenv/config";
import express from "express";
import cors from "cors";
import memoryRouter from "./routes/memory";
import reminderRouter from "./routes/reminder";

const app = express();
app.use(cors());
app.use(express.json());

// Log every request (helps debug Railway / ElevenLabs tool calls)
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Mount routes
app.use("/tool/memory", memoryRouter);
app.use("/tool/reminder", reminderRouter);

// Legacy endpoint for backwards compatibility
// This endpoint is kept for existing ElevenLabs tool configurations
app.post("/tool/save_memory", async (req, res) => {
  const { text, persona } = req.body;
  const userId = "default"; // Default user ID
  
  console.log("🧠 MEMORY TOOL CALLED (legacy):", { text, persona });
  
  if (!text) {
    return res.json({ success: true }); // Backwards compat
  }
  
  try {
    const { saveMemory } = await import("./services/memoryService");
    const memoryId = await saveMemory(userId, text, persona);
    res.json({ success: true, memoryId });
  } catch (err) {
    console.error("Error in legacy endpoint (Firebase may not be configured):", err);
    // Still return success for backwards compatibility even if Firebase fails
    res.json({ success: true });
  }
});

app.get("/", (_, res) => {
  res.json({ status: "backend alive" });
});

// Debug: confirm Railway is reachable and logging works (hit this in browser or curl)
app.get("/tool/ping", (_, res) => {
  console.log("✅ /tool/ping hit - backend is reachable from the internet");
  res.json({ ok: true, message: "backend reachable", ts: new Date().toISOString() });
});

// Export for Vercel serverless functions
// Vercel's @vercel/node builder handles TypeScript and CommonJS
module.exports = app;
export default app;

// Only start server if not running on Vercel
const PORT = process.env.PORT || 4000;

// Check if we're running on Vercel (Vercel sets VERCEL env var)
if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.FIREBASE_PROJECT_ID ? "Firebase configured" : "⚠️  Firebase not configured - add .env file"}`);
  });
}

