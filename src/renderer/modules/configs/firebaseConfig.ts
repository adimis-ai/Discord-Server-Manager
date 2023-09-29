import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB3JwyUw_oEY5W5Jain_dbjwvum0RH8lS0",
  authDomain: "simplifi-dis.firebaseapp.com",
  projectId: "simplifi-dis",
  storageBucket: "simplifi-dis.appspot.com",
  messagingSenderId: "842016017372",
  appId: "1:842016017372:web:fa2360e6b0b7a82c755d19",
  measurementId: "G-XH6H4BKRCT"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);