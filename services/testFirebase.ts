/**
 * Quick Firebase connectivity test.
 * Run with: npx ts-node --project tsconfig.json services/testFirebase.ts
 * OR just check the console logs when the app starts.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAhoaX7bwsI1ppjHMD4Vuf640zCoWeAsLk',
  authDomain: 'kiddocareproject.firebaseapp.com',
  projectId: 'kiddocareproject',
  storageBucket: 'kiddocareproject.firebasestorage.app',
  messagingSenderId: '855045708515',
  appId: '1:855045708515:web:b9347c5ecc3943070a43d6',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function testConnection() {
  console.log('\n🔥 === Firebase Connection Test ===');
  console.log('Project ID:', firebaseConfig.projectId);
  console.log('Auth Domain:', firebaseConfig.authDomain);

  try {
    // Test 1: Auth is initialized
    console.log('\n✅ Firebase Auth initialized:', auth.app.name);

    // Test 2: Firestore can be reached - read children collection
    const snap = await getDocs(collection(db, 'children'));
    console.log(`✅ Firestore connected! children collection has ${snap.size} doc(s)`);

    // Test 3: tasks collection
    const taskSnap = await getDocs(collection(db, 'tasks'));
    console.log(`✅ tasks collection has ${taskSnap.size} doc(s)`);

    // Test 4: parents collection
    const parentSnap = await getDocs(collection(db, 'parents'));
    console.log(`✅ parents collection has ${parentSnap.size} doc(s)`);

    console.log('\n🎉 Firebase is FULLY CONNECTED and operational!\n');

  } catch (error: any) {
    console.error('\n❌ Firebase connection FAILED:');
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    console.log('\n🔧 Common fixes:');
    console.log('  1. Go to Firebase Console → Firestore → Rules');
    console.log('  2. Set rules to allow read/write for testing');
    console.log('  3. Check that Firestore is enabled (not just Auth)');
  }
}

testConnection();
