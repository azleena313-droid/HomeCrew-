Firebase.js 

// ==========================================
// HOME CREW - FIREBASE CONFIG
// ==========================================

// Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// Firebase Authentication
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firestore Database
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==========================================
// YOUR FIREBASE CONFIG
// ==========================================

const firebaseConfig = {
  apiKey: "AIzaSyAC1K77W_3nT4FyrDYhEZAzNSz0gHHPWmo",
  authDomain: "home-crew-beafd.firebaseapp.com",
  projectId: "home-crew-beafd",
  storageBucket: "home-crew-beafd.firebasestorage.app",
  messagingSenderId: "550867732589",
  appId: "1:550867732589:web:8d037eca31d076613ed764",
  measurementId: "G-GYSPZE7LD7"
};

// ==========================================
// INITIALIZE FIREBASE
// ==========================================

const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);

// Firestore
const db = getFirestore(app);

// Export
export { auth, db };