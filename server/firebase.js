// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getAnalytics } = require("firebase/analytics");
const { getStorage } = require("firebase/storage");
const { getAuth } = require("firebase/auth");
const { getFirestore } = require("firebase/firestore")


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmUnh2krkU3nFaR4pgtC4FfAWBDt3Emg8",
  authDomain: "sidequests-lahacks.firebaseapp.com",
  projectId: "sidequests-lahacks",
  storageBucket: "sidequests-lahacks.appspot.com",
  messagingSenderId: "95618950206",
  appId: "1:95618950206:web:eee1766cf8c2b2b3515d6f",
  measurementId: "G-F9PHWWVSZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth()
const database = getFirestore();

module.exports = { storage, auth, database };