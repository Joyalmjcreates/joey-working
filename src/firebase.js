// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBbGX1yioBuA-bTl2MnS5ZSYrhUUIPx2W4",
  authDomain: "joeyapp-14ae0.firebaseapp.com",
  projectId: "joeyapp-14ae0",
  storageBucket: "joeyapp-14ae0.appspot.com",
  messagingSenderId: "970239281985",
  appId: "1:970239281985:web:1b68a7fcbe5dc713116fc0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };