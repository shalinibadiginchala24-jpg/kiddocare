import { collection, doc, updateDoc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const locationService = {
  // Child app saves location to Firebase
  async saveLocation(childId: string = 'mock-child-001', latitude: number, longitude: number) {
    try {
      const q = query(collection(db, 'location'), where('childId', '==', childId));
      const querySnapshot = await getDocs(q);
      
      const timestamp = new Date().toISOString();

      if (!querySnapshot.empty) {
        // Update existing location document
        const docSnap = querySnapshot.docs[0];
        const docRef = doc(db, 'location', docSnap.id);
        await updateDoc(docRef, { latitude, longitude, updatedAt: timestamp });
      } else {
        // Create new location document
        await setDoc(doc(collection(db, 'location')), {
          childId,
          latitude,
          longitude,
          updatedAt: timestamp
        });
      }
      return true;
    } catch (error) {
      console.error("Error saving location:", error);
      throw error;
    }
  },

  // Parent app retrieves child's location
  async getLocation(childId: string = 'mock-child-001') {
    try {
      const q = query(collection(db, 'location'), where('childId', '==', childId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data();
      }
      return null;
    } catch (error) {
      console.error("Error fetching location:", error);
      return null;
    }
  }
};
