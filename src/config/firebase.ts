import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCSbyl8FkGDjoUCUuO2EtShH--uAHOL3hY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'noitruub.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'noitruub',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'noitruub.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '938135666001',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:938135666001:web:2476aba951c1a2b24fa770',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-WBZ3PTNKXZ',
};

// Validate required environment variables
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const missingVars = requiredEnvVars.filter(
  (varName) => !(import.meta.env as any)[varName]
);

if (missingVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingVars.join(', ')}`
  );
  // Don't throw error in production, just log it
  if (import.meta.env.DEV) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;