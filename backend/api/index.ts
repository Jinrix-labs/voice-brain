import "dotenv/config";
import express from "express";
import cors from "cors";
import admin from "firebase-admin";

// --- Firebase init (from src/services/firestore.ts) ---
const projectId = process.env.FIREBASE_PROJECT_ID;
let db: admin.firestore.Firestore | null = null;

if (projectId && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    if (!admin.apps.length) {
      const creds = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      const credential = creds.startsWith("{")
        ? admin.credential.cert(JSON.parse(creds))
        : admin.credential.applicationDefault();
      admin.initializeApp({ credential, projectId });
    }
    db = admin.firestore();
    console.log("✅ Firebase initialized successfully");
  } catch (err) {
    console.error("⚠️  Firebase initialization failed:", err);
  }
} else {
  console.log("⚠️  Firebase not configured - set FIREBASE_PROJECT_ID and GOOGLE_APPLICATION_CREDENTIALS");
}

// --- Memory helpers (from src/services/memoryService.ts) ---
async function saveMemory(userId: string, text: string, persona?: string, tags?: string[]) {
  if (!db) throw new Error("Firebase not configured.");
  const doc = await db.collection("users").doc(userId).collection("memories").add({
    text,
    persona: persona ?? null,
    tags: Array.isArray(tags) ? tags : [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log("🧠 MEMORY SAVED:", { userId, text, persona, memoryId: doc.id });
  return doc.id;
}

async function searchMemories(userId: string, query: string) {
  if (!db) throw new Error("Firebase not configured.");
  const snap = await db
    .collection("users")
    .doc(userId)
    .collection("memories")
    .orderBy("createdAt", "desc")
    .limit(30)
    .get();
  const q = String(query).toLowerCase();
  const results = snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as any) }))
    .filter((m) => String(m.text || "").toLowerCase().includes(q))
    .slice(0, 5);
  console.log("🔍 MEMORY SEARCH:", { userId, query, resultsCount: results.length });
  return results;
}

// --- Express app ---
const app = express();
app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// GET /
app.get("/", (_, res) => {
  res.json({ status: "backend alive" });
});

// GET /tool/ping
app.get("/tool/ping", (_, res) => {
  console.log("✅ /tool/ping hit - backend is reachable from the internet");
  res.json({ ok: true, message: "backend reachable", ts: new Date().toISOString() });
});

// POST /tool/save_memory (legacy)
app.post("/tool/save_memory", async (req, res) => {
  const { text, persona } = req.body || {};
  const userId = "default";
  console.log("🧠 MEMORY TOOL CALLED (legacy):", { text, persona });
  if (!text) return res.json({ success: true });
  try {
    const memoryId = await saveMemory(userId, text, persona);
    res.json({ success: true, memoryId });
  } catch (err) {
    console.error("Error in legacy endpoint (Firebase may not be configured):", err);
    res.json({ success: true });
  }
});

// POST /tool/memory/save
app.post("/tool/memory/save", async (req, res) => {
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

// POST /tool/memory/search
app.post("/tool/memory/search", async (req, res) => {
  const { userId, query } = req.body || {};
  if (!userId || !query) return res.status(400).json({ error: "userId and query are required" });
  try {
    const results = await searchMemories(userId, query);
    res.json({ success: true, results });
  } catch (err) {
    console.error("Error searching memories:", err);
    res.status(500).json({ error: "Failed to search memories" });
  }
});

// POST /tool/reminder/create
app.post("/tool/reminder/create", async (req, res) => {
  const { userId = "default", text, dueAt, persona } = req.body || {};
  if (!text) return res.status(400).json({ error: "text is required" });
  if (!db) return res.status(500).json({ error: "Firebase not configured" });
  try {
    let due: admin.firestore.Timestamp | null = null;
    if (dueAt) {
      const d = new Date(dueAt);
      if (!isNaN(d.getTime())) due = admin.firestore.Timestamp.fromDate(d);
    }
    const doc = await db.collection("users").doc(userId).collection("reminders").add({
      text,
      persona: persona ?? null,
      dueAt: due,
      status: "scheduled",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log("⏰ REMINDER CREATED:", { userId, text, dueAt, reminderId: doc.id });
    res.json({ success: true, reminderId: doc.id });
  } catch (err) {
    console.error("Error creating reminder:", err);
    res.status(500).json({ error: "Failed to create reminder" });
  }
});

// GET /tool/reminder/upcoming
app.get("/tool/reminder/upcoming", async (req, res) => {
  const userId = String(req.query.userId || "");
  if (!userId) return res.status(400).json({ error: "userId is required" });
  if (!db) return res.status(500).json({ error: "Firebase not configured" });
  try {
    const now = admin.firestore.Timestamp.fromDate(new Date());
    const snap = await db
      .collection("users")
      .doc(userId)
      .collection("reminders")
      .where("status", "==", "scheduled")
      .orderBy("dueAt", "asc")
      .limit(10)
      .get();
    const reminders = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    console.log("📋 UPCOMING REMINDERS:", { userId, count: reminders.length });
    res.json({ success: true, reminders, now: now.toDate().toISOString() });
  } catch (err) {
    console.error("Error fetching reminders:", err);
    res.status(500).json({ error: "Failed to fetch reminders" });
  }
});

export default app;
