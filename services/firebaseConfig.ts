/**
 * firebaseConfig.ts — canonical Firebase exports for the whole project.
 * All services import { auth, db } from './firebaseConfig'.
 * This file now delegates to firebase.ts which holds the real credentials
 * and uses getApps() to prevent duplicate app initialisation errors.
 */
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAhoaX7bwsI1ppjHMD4Vuf640zCoWeAsLk',
  authDomain: 'kiddocareproject.firebaseapp.com',
  projectId: 'kiddocareproject',
  storageBucket: 'kiddocareproject.firebasestorage.app',
  messagingSenderId: '855045708515',
  appId: '1:855045708515:web:b9347c5ecc3943070a43d6',
};

// Prevent "Firebase App named '[DEFAULT]' already exists" when hot-reloading
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
