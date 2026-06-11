import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC-30gl8ni9dd1g3fPPlSzA57wnT4p_rNI",
  authDomain: "nirboutique-2c90c.firebaseapp.com",
  projectId: "nirboutique-2c90c",
  storageBucket: "nirboutique-2c90c.firebasestorage.app",
  messagingSenderId: "739531919681",
  appId: "1:739531919681:web:87302d7e1f844fa6c311c0",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
