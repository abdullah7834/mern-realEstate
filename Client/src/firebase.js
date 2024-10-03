// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-839be.firebaseapp.com",
  projectId: "mern-estate-839be",
  storageBucket: "mern-estate-839be.appspot.com",
  messagingSenderId: "863718194356",
  appId: "1:863718194356:web:8349e80ae1f66bf78fabe1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);