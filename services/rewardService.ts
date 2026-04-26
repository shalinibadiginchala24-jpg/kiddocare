import { collection, doc, updateDoc, setDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const rewardService = {
  async updateRewards(childId: string, pointsToAdd: number) {
    const q = query(collection(db, 'rewards'), where('childId', '==', childId));
    const qs = await getDocs(q);
    
    if (!qs.empty) {
      const docSnap = qs.docs[0];
      const docRef = doc(db, 'rewards', docSnap.id);
      await updateDoc(docRef, { stars: (docSnap.data().stars || 0) + pointsToAdd });
    } else {
      await setDoc(doc(collection(db, 'rewards')), { childId, stars: pointsToAdd });
    }
  },

  async getRewards(childId: string) {
    const q = query(collection(db, 'rewards'), where('childId', '==', childId));
    const qs = await getDocs(q);
    if (!qs.empty) return qs.docs[0].data().stars;
    return 0;
  }
};
