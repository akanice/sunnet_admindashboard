import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBBApPjatrwlA2V0PRI-be5_huSKkbzla0",
    authDomain: "blueocean-94f0b.firebaseapp.com",
    projectId: "blueocean-94f0b",
    storageBucket: "blueocean-94f0b.firebasestorage.app",
    messagingSenderId: "31340527771",
    appId: "1:31340527771:web:10814e1649e654b358063e",
    measurementId: "G-X9DVZQK3W8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, signInWithEmailAndPassword, signOut };