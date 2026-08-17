// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBT6NG4N_dQE9WH4Ne195TERSDvxgYn96g",
  authDomain: "road-incident-inteligence.firebaseapp.com",
  projectId: "road-incident-inteligence",
  storageBucket: "road-incident-inteligence.firebasestorage.app",
  messagingSenderId: "1054592553537",
  appId: "1:1054592553537:web:2dacccc6686e396fbf6cc0",
  measurementId: "G-047DDZ005G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);