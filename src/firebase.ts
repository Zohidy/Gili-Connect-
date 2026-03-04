import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1Q1eRGetcuQTfXksATRHBWznpO_n_-uI",
  authDomain: "gili-connect.firebaseapp.com",
  projectId: "gili-connect",
  storageBucket: "gili-connect.firebasestorage.app",
  messagingSenderId: "442074454570",
  appId: "1:442074454570:web:e12344c3260c6bbc33c153",
  measurementId: "G-N0NFW2HM5M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

export default app;
