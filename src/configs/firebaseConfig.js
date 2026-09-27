import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // apiKey: "AIzaSyCE3SMHNFkM5zPWLgF1rmBwbw7UJLYQmv4",
  // authDomain: "guest-service-center.firebaseapp.com",
  // projectId: "guest-service-center",
  // storageBucket: "guest-service-center.appspot.com",
  // messagingSenderId: "334335178460",
  // appId: "1:334335178460:web:98e5d5a6dc8da44355e619",
  // measurementId: "G-3KP2EX8751"
  apiKey: "AIzaSyD_J1RKDTIOkdImL-6Q5Fa_AB2QAMgciys",
  authDomain: "mina-b613e.firebaseapp.com",
  databaseURL: "https://mina-b613e-default-rtdb.firebaseio.com",
  projectId: "mina-b613e",
  storageBucket: "mina-b613e.firebasestorage.app",
  messagingSenderId: "756521396454",
  appId: "1:756521396454:web:fe1ba5dc4af5f524d47327",
  measurementId: "G-RZFW6G0Y5J"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth();

export { app, db, auth, storage };
