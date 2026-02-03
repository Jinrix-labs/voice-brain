import { Router } from "express";
import { db } from "../services/firestore";
import admin from "firebase-admin";

const router = Router();

router.post("/create", async (req, res) => {
  const { userId = "default", text, dueAt, persona } = req.body;

  if (!text) {
    return res.status(400).json({ error: "text is required" });
  }

  if (!db) {
    return res.status(500).json({ error: "Firebase not configured" });
  }

  try {
    // MVP: accept ISO string if provided, else null
    let due: FirebaseFirestore.Timestamp | null = null;
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

router.get("/upcoming", async (req, res) => {
  const userId = String(req.query.userId || "");
  if (!userId) return res.status(400).json({ error: "userId is required" });

  if (!db) {
    return res.status(500).json({ error: "Firebase not configured" });
  }

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

export default router;

