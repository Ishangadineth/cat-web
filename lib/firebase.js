import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyCsyY2AogD79UjuzBUj-tMIWTZEdLk79bFw",
    authDomain: "petgoofy-a43cc.firebaseapp.com",
    projectId: "petgoofy-a43cc",
    storageBucket: "petgoofy-a43cc.firebasestorage.app",
    messagingSenderId: "713281566956",
    appId: "1:713281566956:web:5e461d438bb8c7287b8dc9",
    measurementId: "G-NNM53DK7GT"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
