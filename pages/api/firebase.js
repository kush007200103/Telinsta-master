import { initializeApp } from "firebase/app";
import "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWrY-d3TBQ5VK9B4eAYpLIzG-49f730Zs",
  authDomain: "telinsta-376a3.firebaseapp.com",
  projectId: "telinsta-376a3",
  storageBucket: "telinsta-376a3.appspot.com",
  messagingSenderId: "269357821417",
  appId: "1:269357821417:web:d3da9a7cb0965a44352f78"
};

const firebase = initializeApp(firebaseConfig);

export default firebase;