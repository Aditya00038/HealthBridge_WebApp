import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCYiSTqzsb2WyshOhNuNQPAXv0aQCzAXrM",
  authDomain: "es-healthbridge.firebaseapp.com",
  projectId: "es-healthbridge",
  storageBucket: "es-healthbridge.firebasestorage.app",
  messagingSenderId: "30331413637",
  appId: "1:30331413637:web:ba42d768ad6aed445f75ec",
  measurementId: "G-1Q1MNZE383"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);

export default app;
