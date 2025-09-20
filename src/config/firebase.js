// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBE6L-BnsFgOmZzeMvPrf24rXWflNF-bqk",
  authDomain: "farmer-export.firebaseapp.com",
  projectId: "farmer-export",
  storageBucket: "farmer-export.firebasestorage.app",
  messagingSenderId: "73225893814",
  appId: "1:73225893814:web:2fc06779c246ba29edb317",
  measurementId: "G-9JTYZ37YGY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();