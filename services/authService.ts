import { collection, addDoc, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';
import { signInWithEmailAndPassword as firebaseSignIn, createUserWithEmailAndPassword as firebaseSignUp } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  // --- PARENT AUTH ---
  async parentSignUp(name: string, email: string, password: string) {
    try {
      const userCredential = await firebaseSignUp(auth, email, password);
      const parentData = {
        parentId: userCredential.user.uid,
        name,
        email,
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, 'parents'), parentData);
      
      // Save both ID and name so dashboard works immediately after signup
      await AsyncStorage.setItem('parentId', userCredential.user.uid);
      await AsyncStorage.setItem('parentName', name);
      return parentData;
    } catch (error) {
      console.error("Error signing up parent:", error);
      throw error;
    }
  },

  async parentLogin(email: string, password: string) {
    try {
      const userCredential = await firebaseSignIn(auth, email, password);
      const q = query(collection(db, 'parents'), where('parentId', '==', userCredential.user.uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        await AsyncStorage.setItem('parentId', userCredential.user.uid);
        if (data.name) await AsyncStorage.setItem('parentName', data.name);
        return { docId: docSnap.id, ...data };
      }
      throw new Error("Parent profile not found.");
    } catch (error) {
      console.error("Error logging in parent:", error);
      throw error;
    }
  },

  // --- CHILD AUTH ---
  async createChild(parentId: string, name: string, pin: string) {
    try {
      const docRef = await addDoc(collection(db, 'children'), {
        parentId,
        name,
        pin,
        createdAt: new Date().toISOString()
      });
      return { childId: docRef.id, parentId, name, pin };
    } catch (error) {
      console.error("Error creating child:", error);
      throw error;
    }
  },

  async childLogin(name: string, pin: string) {
    try {
      // Lookup by name and pin for a separate login system
      const q = query(collection(db, 'children'), where('name', '==', name), where('pin', '==', pin));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        await AsyncStorage.setItem('childId', docSnap.id);
        await AsyncStorage.setItem('parentId', data.parentId);
        return { childId: docSnap.id, ...data };
      }
      throw new Error("Invalid Name or PIN.");
    } catch (error) {
      console.error("Error logging in child:", error);
      throw error;
    }
  },

  async logout(role?: 'parent' | 'child') {
    if (role === 'parent') {
      await AsyncStorage.multiRemove(['parentId', 'parentName', 'activeRole']);
    } else if (role === 'child') {
      await AsyncStorage.multiRemove(['childId', 'childName', 'activeRole']);
    } else {
      await AsyncStorage.multiRemove(['parentId', 'parentName', 'childId', 'childName', 'activeRole']);
    }
    
    try {
      if (role !== 'child' && auth.currentUser) {
        await auth.signOut();
      }
    } catch (e) {
      console.log('Auth signout skipped:', e);
    }
  }
};
