// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
 
  authDomain: 'remote-internship-66a70.firebaseapp.com',
  projectId: 'remote-internship-66a70',
  storageBucket: 'remote-internship-66a70.appspot.com',
  messagingSenderId: '754469384957',
  appId: '1:754469384957:web:b95b7563cfbec9fb12c494', // Replace with your actual App ID from Firebase Console
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

