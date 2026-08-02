import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDupbwagCiP12m1ECTgOzpk8ARGXC1HYHk",
  authDomain: "ha-development-9320c.firebaseapp.com",
  projectId: "ha-development-9320c",
  storageBucket: "ha-development-9320c.firebasestorage.app",
  messagingSenderId: "777481007131",
  appId: "1:777481007131:web:81f214968c2abdd12988be",
  measurementId: "G-2VWQK9RYP2",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
