// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcZ4XTAHcOToDyv4i_in8EIRf8GTJmBBs",
  authDomain: "memories-95ddc.firebaseapp.com",
  projectId: "memories-95ddc",
  storageBucket: "memories-95ddc.appspot.com",
  messagingSenderId: "1057447478888",
  appId: "1:1057447478888:web:af867564774b2882c9dddd",
  measurementId: "G-DB65X9NH3Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app)
