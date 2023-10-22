// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAOI23k2DUPid1dxlAtCIDJc54OcLxupGU",
    authDomain: "bookstore-ca165.firebaseapp.com",
    databaseURL: "https://bookstore-ca165-default-rtdb.firebaseio.com",
    projectId: "bookstore-ca165",
    storageBucket: "bookstore-ca165.appspot.com",
    messagingSenderId: "576101549016",
    appId: "1:576101549016:web:398a8a2ee38b89f8a1a8ad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export  const db = getDatabase(app);
