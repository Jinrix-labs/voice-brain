import { db } from "./firestore";
import admin from "firebase-admin";

export async function saveMemory(userId: string, text: string, persona?: string, tags?: string[]) {
  if (!db) {
    throw new Error("Firebase not configured. Please set up .env file with Firebase credentials.");
  }

  const doc = await db.collection("users").doc(userId).collection("memories").add({
    text,
    persona: persona ?? null,
    tags: Array.isArray(tags) ? tags : [],
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log("🧠 MEMORY SAVED:", { userId, text, persona, memoryId: doc.id });
  return doc.id;
}

export async function searchMemories(userId: string, query: string) {
  if (!db) {
    throw new Error("Firebase not configured. Please set up .env file with Firebase credentials.");
  }

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

