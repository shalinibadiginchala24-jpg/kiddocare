import { collection, addDoc, getDocs, query, where, updateDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const taskService = {
  async createTask(title: string, assignedTo: string, createdBy: string) {
    try {
      const docRef = await addDoc(collection(db, 'tasks'), {
        title,
        assignedTo,
        createdBy,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      return { taskId: docRef.id, title, assignedTo, createdBy, status: 'pending' };
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async getTasksForChild(childId: string) {
    try {
      const q = query(collection(db, 'tasks'), where('assignedTo', '==', childId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ taskId: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching child tasks:", error);
      throw error;
    }
  },

  async getTasksForParent(parentId: string) {
    try {
      const q = query(collection(db, 'tasks'), where('createdBy', '==', parentId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ taskId: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching parent tasks:", error);
      throw error;
    }
  },

  async updateTaskStatus(taskId: string, status: 'pending' | 'completed') {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { status });
    } catch (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  },

  subscribeToChildTasks(childId: string, callback: (tasks: any[]) => void) {
    const q = query(collection(db, 'tasks'), where('assignedTo', '==', childId));
    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({ taskId: doc.id, ...doc.data() }));
      callback(tasks);
    });
  }
};
