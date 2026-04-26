import { collection, addDoc, getDocs, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';

export const chatService = {
  /**
   * Send a message
   * @param childId The ID of the child involved in the chat
   * @param sender 'parent' or 'child'
   * @param text The message text
   */
  async sendMessage(childId: string, sender: 'parent' | 'child', text: string) {
    if (!text.trim()) return;
    try {
      await addDoc(collection(db, 'chats'), {
        childId,
        sender,
        text: text.trim(),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  /**
   * Listen to real-time chat messages for a specific child
   */
  subscribeToChat(childId: string, callback: (messages: any[]) => void) {
    const q = query(
      collection(db, 'chats'),
      where('childId', '==', childId)
    );
    
    return onSnapshot(q, (snapshot) => {
      const messages: any[] = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      messages.sort((a, b) => (a.timestamp || '').localeCompare(b.timestamp || ''));
      callback(messages);
    });
  }
};
