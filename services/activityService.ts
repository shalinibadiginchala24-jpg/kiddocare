import { collection, doc, updateDoc, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const activityService = {
  async addActivity(title: string, childId: string) {
    const today = new Date().toISOString().split('T')[0];
    const docRef = await addDoc(collection(db, 'activities'), {
      title,
      childId,
      completed: false,
      date: today
    });
    return { id: docRef.id, title, childId, completed: false, date: today };
  },

  async getActivities(childId: string) {
    const today = new Date().toISOString().split('T')[0];
    const q = query(collection(db, 'activities'), where('childId', '==', childId), where('date', '==', today));
    const qs = await getDocs(q);
    const activities: any[] = [];
    qs.forEach(doc => activities.push({ id: doc.id, ...doc.data() }));
    return activities;
  },

  async completeActivity(activityId: string) {
    const activityRef = doc(db, 'activities', activityId);
    await updateDoc(activityRef, { completed: true });
    return true;
  }
};
