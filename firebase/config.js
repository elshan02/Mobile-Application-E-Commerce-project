// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUOGUVc2OI7qyGsIYaKX6GsY-17X1D6j0",
  authDomain: "e-commerce-mobile-app-2025.firebaseapp.com",
  projectId: "e-commerce-mobile-app-2025",
  storageBucket: "e-commerce-mobile-app-2025.firebasestorage.app",
  messagingSenderId: "103546688407",
  appId: "1:103546688407:web:7a963295649fbcbe7a5a5d",
  measurementId: "G-V9ZBWhGN3S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize and export firestore
export { auth };
export const db = getFirestore(app);