import { collection, addDoc, getDocs, doc, setDoc, getDoc, query, where, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const childService = {
  async createChild(parentId: string, name: string, pin: string, customId?: string) {
    let finalId = customId?.trim();
    
    // Auto-generate a readable ID if not provided: (e.g. "alex492")
    if (!finalId) {
       const cleanName = name.trim().replace(/\s+/g, '').toLowerCase();
       const randomNum = Math.floor(100 + Math.random() * 900);
       finalId = `${cleanName}${randomNum}`;
    }
    
    const docRef = doc(db, 'children', finalId);
    
    // Ensure we don't accidentally overwrite an existing child with the same ID
    const existing = await getDoc(docRef);
    if (existing.exists()) {
      throw new Error('This Child Login ID is already taken. Please try a different one.');
    }

    await setDoc(docRef, {
      parentId,
      name,
      pin,
      createdAt: new Date().toISOString()
    });
    return { id: finalId, parentId, name, pin };
  },

  async getChildrenByParent(parentId: string) {
    const q = query(collection(db, 'children'), where('parentId', '==', parentId));
    const qs = await getDocs(q);
    const children: any[] = [];
    qs.forEach(doc => children.push({ id: doc.id, ...doc.data() }));
    return children;
  },

  async validateChildLogin(childId: string, pin: string) {
    const docRef = doc(db, 'children', childId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('Child not found');
    if (docSnap.data().pin !== pin) throw new Error('Invalid PIN');
    return { id: docSnap.id, ...docSnap.data() };
  },

  async validateChildLoginByNameAndPin(name: string, pin: string) {
    // Note: To make case-insensitive match, ideally you would store lowercase or use a library, 
    // but we will do exact match for simplicity as requested.
    const q = query(collection(db, 'children'), where('pin', '==', pin), where('name', '==', name));
    const qs = await getDocs(q);
    if (qs.empty) throw new Error('Invalid Name or PIN, or child not found');
    const docSnap = qs.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  },

  async updateChild(childId: string, data: any) {
    const docRef = doc(db, 'children', childId);
    await updateDoc(docRef, data);
    return { id: childId, ...data };
  },

  async getChild(childId: string) {
    const docRef = doc(db, 'children', childId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) throw new Error('Child not found');
    return { id: docSnap.id, ...docSnap.data() };
  },

  async deleteChild(childId: string) {
    const docRef = doc(db, 'children', childId);
    await deleteDoc(docRef);
    return childId;
  }
};
