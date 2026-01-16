
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAdQ7nXyK7VoHcgklxGQ0OOWv6_JhDObOE",
    authDomain: "suvietaitutor.firebaseapp.com",
    projectId: "suvietaitutor",
    storageBucket: "suvietaitutor.firebasestorage.app",
    messagingSenderId: "126903071225",
    appId: "1:126903071225:web:3caeb9b728166bfb0f0d28",
    measurementId: "G-N0HETJXZ6C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
