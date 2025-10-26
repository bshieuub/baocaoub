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

// Validate Firebase config in development only
if (import.meta.env.DEV) {
  const requiredEnvVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID',
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    console.warn(
      `⚠️ Missing environment variables: ${missingVars.join(', ')}\nUsing fallback values from config.`
    );
  }
}

// Initialize Firebase
console.log('🔥 Initializing Firebase with project:', firebaseConfig.projectId);
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Expose db to window for migration script
if (typeof window !== 'undefined') {
  (window as any).__FIREBASE_DB__ = db;
}

export default app;
