import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyB7VJU6wYAVibLMjIKyPoV2CANUMPSs-14",
  authDomain: "crypto-trade-78cdd.firebaseapp.com",
  projectId: "crypto-trade-78cdd",
  storageBucket: "crypto-trade-78cdd.appspot.com",
  messagingSenderId: "221902436855",
  appId: "1:221902436855:web:74bc5cdfb429c1663256f2",
  measurementId: "G-9MFYK7FBDJ",
});
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
export default db;
export { auth, provider };
