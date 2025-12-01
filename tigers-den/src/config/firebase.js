import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCQs-0fXqSjbciwyygebtKXBLv0cGYASWU",
    authDomain: "tigers-den-app.firebaseapp.com",
    databaseURL: "https://tigers-den-app-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tigers-den-app",
    storageBucket: "tigers-den-app.firebasestorage.app",
    messagingSenderId: "658977955626",
    appId: "1:658977955626:web:d8e0777a87ff14cd878853",
    measurementId: "G-6BK3BQLV17"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
