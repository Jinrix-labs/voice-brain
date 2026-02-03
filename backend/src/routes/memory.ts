import { Router } from "express";
import { saveMemory, searchMemories } from "../services/memoryService";

const router = Router();

router.post("/save", async (req, res) => {
  // Accept text from body or nested (ElevenLabs may send input/arguments)
  const body = req.body || {};
  const text =
    body.text ??
    body.input?.text ??
    (typeof body.arguments === "object" && body.arguments?.text) ??
    (typeof body.input === "string" ? body.input : undefined);
  const userId = body.userId ?? body.input?.userId ?? "default";
  const persona = body.persona ?? body.input?.persona;
  const tags = body.tags ?? body.input?.tags;

  if (!text) {
    console.log("⚠️ /tool/memory/save missing text, body:", JSON.stringify(body));
    return res.status(400).json({ error: "text is required" });
  }

  try {
    const memoryId = await saveMemory(userId, text, persona, tags);
    res.json({ success: true, memoryId });
  } catch (err) {
    console.error("Error saving memory:", err);
    res.status(500).json({ error: "Failed to save memory" });
  }
});

// MVP search: keyword contains (good enough for demo 1)
router.post("/search", async (req, res) => {
  const { userId, query } = req.body;

  if (!userId || !query) {
    return res.status(400).json({ error: "userId and query are required" });
  }

  try {
    const results = await searchMemories(userId, query);
    res.json({ success: true, results });
  } catch (err) {
    console.error("Error searching memories:", err);
    res.status(500).json({ error: "Failed to search memories" });
  }
});

export default router;

