import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCrw2J_V619odShlLd5ZntLLkKnm-tg-VA",
    authDomain: "moodlift-chat.firebaseapp.com",
    projectId: "moodlift-chat",
    storageBucket: "moodlift-chat.appspot.com",
    messagingSenderId: "105910549934",
    appId: "1:105910549934:web:002c1b16e191aaccf1dc3f",
    measurementId: "G-1SEZR7VBLS"
};
 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };