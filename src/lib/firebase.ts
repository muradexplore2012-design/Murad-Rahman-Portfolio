import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

/* 
=============================================================================
🔶 PASTE FIREBASE CONFIG HERE 🔶
=============================================================================
These environment variables are loaded from your .env or .env.local file.
Configure these in Firebase Console:
https://console.firebase.google.com/ > Project Settings > General > Your apps
=============================================================================
*/
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDfl5pmu20OjAw9DJzFTxOFJmIzUDUhwuk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "muradrahman.netlify.app",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "murad-rahman-994ed",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "murad-rahman-994ed.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "791694775814",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:791694775814:web:da0531cb1a9f6866ae1587",
};

// Check if Firebase is configured with real values
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "your-api-key" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "your-project-id"
);

// Singleton Firebase initialization
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (error) {
  console.warn("Firebase initialization warning (check your .env config):", error);
}

export { app, auth, db, storage, firebaseConfig };
