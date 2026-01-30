import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase configuration using environment variables
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app, auth, db, appId;

try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    appId = firebaseConfig.projectId || 'thaisim2569';
} catch (e) {
    console.error("Firebase Init Error:", e);
}

// Export Firebase services
export { app, auth, db, appId, signInAnonymously, collection, addDoc, getDocs };

/**
 * Check if current date is within the pre-election blackout period
 * per Thai law (พ.ร.ป.สส.ฯ มาตรา 72 ประกอบมาตรา 157)
 * Blackout: January 30 - February 8, 2026 (Thai year 2569)
 * @returns {boolean} true if currently in blackout period
 */
export function isBlackoutPeriod() {
    const now = new Date();
    const start = new Date('2026-01-30T18:00:00+07:00'); // Jan 30, 2026 18:00 ICT (Thai year 2569)
    const end = new Date('2026-02-08T17:30:00+07:00');   // Feb 8, 2026 17:30 ICT (Thai year 2569)
    return now >= start && now <= end;
}
