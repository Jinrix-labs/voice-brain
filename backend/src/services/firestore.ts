import admin from "firebase-admin";

const projectId = process.env.FIREBASE_PROJECT_ID;

let db: admin.firestore.Firestore | null = null;

if (projectId && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  try {
    if (!admin.apps.length) {
      let credential;
      
      // Check if GOOGLE_APPLICATION_CREDENTIALS is a JSON string (Railway) or file path (local)
      const creds = process.env.GOOGLE_APPLICATION_CREDENTIALS;
      if (creds.startsWith('{')) {
        // It's a JSON string (Railway deployment)
        const serviceAccount = JSON.parse(creds);
        credential = admin.credential.cert(serviceAccount);
      } else {
        // It's a file path (local development)
        credential = admin.credential.applicationDefault();
      }
      
      admin.initializeApp({
        credential,
        projectId,
      });
    }
    db = admin.firestore();
    console.log("✅ Firebase initialized successfully");
  } catch (err) {
    console.error("⚠️  Firebase initialization failed:", err);
    console.log("⚠️  Backend will run without Firebase (memories won't be saved)");
  }
} else {
  console.log("⚠️  Firebase not configured - set FIREBASE_PROJECT_ID and GOOGLE_APPLICATION_CREDENTIALS in .env");
  console.log("⚠️  Backend will run without Firebase (memories won't be saved)");
}

export { db };

export type Memory = {
  text: string;
  persona?: string;
  createdAt: FirebaseFirestore.Timestamp;
  tags?: string[];
};

export type Reminder = {
  text: string;
  persona?: string;
  dueAt?: FirebaseFirestore.Timestamp | null;
  status: "scheduled" | "sent" | "done";
  createdAt: FirebaseFirestore.Timestamp;
};

