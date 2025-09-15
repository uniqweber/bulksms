// firebase.ts
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";

const firebaseConfig = {
    // apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    // authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    // projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    // storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    // messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    // appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    apiKey: "AIzaSyA4TAcyzLPsT7SCCv6OVjtOhjmpYY2PzjI",
    authDomain: "bulksms-pro-7add7.firebaseapp.com",
    projectId: "bulksms-pro-7add7",
    storageBucket: "bulksms-pro-7add7.firebasestorage.app",
    messagingSenderId: "872694046473",
    appId: "1:872694046473:web:f563df3f7c0cc1dc123dd8",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
