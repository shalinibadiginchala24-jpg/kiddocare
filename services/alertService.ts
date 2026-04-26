import { collection, addDoc, getDocs, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const alertService = {
  // System sends alert
  async addAlert(childId: string = 'mock-child-001', message: string, type: 'warning' | 'info' | 'danger') {
    try {
      const docRef = await addDoc(collection(db, 'alerts'), {
        childId,
        message,
        type,
        timestamp: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error generating alert:", error);
      throw error;
    }
  },

  // Parent dashboard fetches alerts
  async getAlerts(childId: string = 'mock-child-001') {
    try {
      const q = query(
        collection(db, 'alerts'), 
        where('childId', '==', childId)
      );
      const querySnapshot = await getDocs(q);
      const alerts: any[] = [];
      querySnapshot.forEach((doc) => {
        alerts.push({ id: doc.id, ...doc.data() });
      });
      alerts.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
      return alerts.slice(0, 10);
    } catch (error) {
      console.error("Error fetching alerts:", error);
      return [];
    }
  },

  // Real-time listener for parent dashboard
  subscribeToAlerts(childId: string, callback: (alerts: any[]) => void) {
    const q = query(
      collection(db, 'alerts'),
      where('childId', '==', childId)
    );
    
    return onSnapshot(q, (snapshot) => {
      const alerts: any[] = [];
      snapshot.forEach((doc) => {
        alerts.push({ id: doc.id, ...doc.data() });
      });
      alerts.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
      callback(alerts.slice(0, 10));
    });
  }
};
