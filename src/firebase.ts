import { initializeApp, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

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
let app: FirebaseApp;
let analytics: Analytics | null = null;
let auth: Auth;
let db: Firestore;
let googleProvider: GoogleAuthProvider;

try {
  app = initializeApp(firebaseConfig);
  analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
  auth = getAuth(app);
  db = getFirestore(app);
  googleProvider = new GoogleAuthProvider();
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization failed:", error);
  // Do not throw, let the app try to start so ErrorBoundary can catch usage errors
}

export { app, analytics, auth, db, googleProvider };
export default app;
