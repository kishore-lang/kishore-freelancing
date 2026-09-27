import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const isConfigured = 
  import.meta.env.VITE_FIREBASE_API_KEY && 
  import.meta.env.VITE_FIREBASE_API_KEY !== "YOUR_API_KEY";

if (!isConfigured) {
  console.warn("⚠️ Firebase Environment Variables are missing! Please set VITE_FIREBASE_* variables in your .env or Render dashboard.");
}

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "portfolio-demo-14a3f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "portfolio-demo-14a3f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "portfolio-demo-14a3f.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1063255142052",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

