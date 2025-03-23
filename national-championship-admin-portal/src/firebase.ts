// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-9c42f.firebaseapp.com",
  projectId: "mern-blog-9c42f",
  storageBucket: "mern-blog-9c42f.appspot.com",
  messagingSenderId: "138008551407",
  appId: "1:138008551407:web:fcafcb79f6a51e7f47601a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

