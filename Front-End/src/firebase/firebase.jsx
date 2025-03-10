import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAWnZiCCuA-YmtXYaQ9EvZGXYKI6hhop_E",
    authDomain: "outfit-stylists.firebaseapp.com",
    projectId: "outfit-stylists",
    storageBucket: "outfit-stylists.firebasestorage.app",
    messagingSenderId: "714350218065",
    appId: "1:714350218065:web:3b5860cb51c40c42562170"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
