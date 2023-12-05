const { initializeApp } = require("firebase/app");
const { getAuth } = require("firebase/auth");
const { getFirestore, collection, getDocs } = require("firebase/firestore");


const firebaseConfig = {
  apiKey: "AIzaSyD9qsjidur11bq2Mji5nPEzduoBdH07kwU",
  authDomain: "cleaningservice-admin-panel.firebaseapp.com",
  projectId: "cleaningservice-admin-panel",
  storageBucket: "cleaningservice-admin-panel.appspot.com",
  messagingSenderId: "1044804232348",
  appId: "1:1044804232348:web:43cf2c517aaac27154b959"
};
console.log("HELLOOOO")

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


module.exports = { db,auth };