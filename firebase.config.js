import { getAuth } from "firebase/auth";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDI674THQiO2b2so3MdDm0mcFK39aIpQDE",
  authDomain: "baits-task-management-system.firebaseapp.com",
  projectId: "baits-task-management-system",
  storageBucket: "baits-task-management-system.appspot.com",
  messagingSenderId: "163293986698",
  appId: "1:163293986698:web:8eaa53cf4de8c0d797d273",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
