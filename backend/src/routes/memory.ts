import { Router } from "express";
import { saveMemory, searchMemories } from "../services/memoryService";

const router = Router();

router.post("/save", async (req, res) => {
  const { userId, text, persona, tags } = req.body;

  if (!userId || !text) {
    return res.status(400).json({ error: "userId and text are required" });
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

