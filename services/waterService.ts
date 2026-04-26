import { collection, doc, updateDoc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const waterService = {
  // Update the water count for today
  async updateWater(childId: string = 'mock-child-001', count: number) {
    try {
      const today = new Date().toISOString().split('T')[0]; // Current date string
      const q = query(collection(db, 'waterTracker'), where('childId', '==', childId), where('date', '==', today));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Update existing record for today
        const docSnap = querySnapshot.docs[0];
        const docRef = doc(db, 'waterTracker', docSnap.id);
        await updateDoc(docRef, { count });
      } else {
        // Create new record for today
        await setDoc(doc(collection(db, 'waterTracker')), {
          childId,
          count,
          date: today
        });
      }
      return true;
    } catch (error) {
      console.error("Error updating water tracker:", error);
      throw error;
    }
  },

  // Fetch today's water count
  async getWater(childId: string = 'mock-child-001') {
    try {
      const today = new Date().toISOString().split('T')[0];
      const q = query(collection(db, 'waterTracker'), where('childId', '==', childId), where('date', '==', today));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        return querySnapshot.docs[0].data().count;
      }
      return 0; // Return 0 if no record exists for today
    } catch (error) {
      console.error("Error fetching water count:", error);
      return 0;
    }
  }
};
