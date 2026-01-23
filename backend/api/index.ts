// Vercel API route handler
// This file is automatically detected by Vercel when in the api/ directory
import "dotenv/config";
import express from "express";
import cors from "cors";
import memoryRouter from "../src/routes/memory";
import reminderRouter from "../src/routes/reminder";

const app = express();
app.use(cors());
app.use(express.json());

// Mount routes
app.use("/tool/memory", memoryRouter);
app.use("/tool/reminder", reminderRouter);

// Legacy endpoint for backwards compatibility
app.post("/tool/save_memory", async (req, res) => {
  const { text, persona } = req.body;
  const userId = "default";
  
  console.log("🧠 MEMORY TOOL CALLED (legacy):", { text, persona });
  
  if (!text) {
    return res.json({ success: true });
  }
  
  try {
    const { saveMemory } = await import("../src/services/memoryService");
    const memoryId = await saveMemory(userId, text, persona);
    res.json({ success: true, memoryId });
  } catch (err) {
    console.error("Error in legacy endpoint (Firebase may not be configured):", err);
    res.json({ success: true });
  }
});

app.get("/", (_, res) => {
  res.json({ status: "backend alive" });
});

// Export the Express app for Vercel
export default app;
