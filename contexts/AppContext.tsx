import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebaseConfig';
import { collection, doc, onSnapshot, setDoc, addDoc, updateDoc } from 'firebase/firestore';
import { Alert as NativeAlert } from 'react-native';
import { taskService } from '../services/taskService';

export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export type Alert = {
  id: string;
  message: string;
  timestamp: number;
};

type AppContextType = {
  tasks: Task[];
  stars: number;
  hugs: number;
  alerts: Alert[];
  waterConsumed: number;
  gratitudeNotes: string[];
  addTask: (title: string) => void;
  sendHug: () => void;
  completeTask: (taskId: string) => void;
  triggerSOS: () => void;
  clearAlerts: () => void;
  logWater: () => void;
  addGratitude: (note: string) => void;
  requestCall: (contact: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stars, setStars] = useState(0);
  const [hugs, setHugs] = useState(0);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [waterConsumed, setWaterConsumed] = useState(0);
  const [gratitudeNotes, setGratitudeNotes] = useState<string[]>([]);
  const FAMILY_DOC = 'demo_family';

  useEffect(() => {
    const familyRef = doc(db, 'families', FAMILY_DOC);
    
    setDoc(familyRef, { stars: 0, hugs: 0 }, { merge: true }).catch(err => {
      console.warn("Firebase Setup Warning (Likely dummy keys):", err);
    });

    const unsubFamily = onSnapshot(familyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setStars(data.stars || 0);
        setHugs(data.hugs || 0);
      }
    }, (error) => {
      console.warn("Firebase WebSocket Failed (Operating in Demo Fallback Mode)");
    });

    const tasksRef = collection(db, 'families', FAMILY_DOC, 'tasks');
    const unsubTasks = onSnapshot(tasksRef, (snapshot) => {
      const liveTasks: Task[] = [];
      snapshot.forEach(doc => {
        liveTasks.push({ id: doc.id, ...doc.data() } as Task);
      });
      if (liveTasks.length > 0) setTasks(liveTasks);
    });

    const alertsRef = collection(db, 'families', FAMILY_DOC, 'alerts');
    const unsubAlerts = onSnapshot(alertsRef, (snapshot) => {
      const liveAlerts: Alert[] = [];
      snapshot.forEach(doc => {
        liveAlerts.push({ id: doc.id, ...doc.data() } as Alert);
      });
      if (liveAlerts.length > 0) setAlerts(liveAlerts.sort((a,b) => b.timestamp - a.timestamp));
    });

    return () => {
      unsubFamily();
      unsubTasks();
      unsubAlerts();
    };
  }, []);

  const addTask = async (title: string) => {
    const fallbackId = Date.now().toString();
    setTasks([...tasks, { id: fallbackId, title, completed: false }]);
    try {
      // Note: This is a legacy call, assignedTo and createdBy are missing here
      // This context seems redundant now, but fixing types for now
      await taskService.createTask(title, 'demo_child', 'demo_parent');
    } catch(e) {}
  };

  const completeTask = async (taskId: string) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, completed: true } : task));
    setStars(s => s + 1);
    try {
      await taskService.updateTaskStatus(taskId, 'completed');
    } catch(e) {}
  };

  const sendHug = async () => {
    setHugs(h => h + 1);
    NativeAlert.alert('Hug Sent! 💖', 'Your parent just got a hug!');
    try {
      const familyRef = doc(db, 'families', FAMILY_DOC);
      await updateDoc(familyRef, { hugs: hugs + 1 });
    } catch (e) {}
  };

  const triggerSOS = async () => {
    setAlerts([{ id: Date.now().toString(), message: '🚨 SOS Alert from Child!', timestamp: Date.now() }, ...alerts]);
    try {
      const alertsRef = collection(db, 'families', FAMILY_DOC, 'alerts');
      await addDoc(alertsRef, { message: '🚨 SOS Alert from Child!', timestamp: Date.now() });
    } catch (e) {}
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  const logWater = async () => {
    setWaterConsumed(w => w + 1);
  };

  const addGratitude = async (note: string) => {
    setGratitudeNotes(prev => [note, ...prev]);
  };

  const requestCall = async (contact: string) => {
    setAlerts([{ id: Date.now().toString(), message: `📞 Call request sent to ${contact}!`, timestamp: Date.now() }, ...alerts]);
    try {
      const alertsRef = collection(db, 'families', FAMILY_DOC, 'alerts');
      await addDoc(alertsRef, { message: `📞 Call request sent to ${contact}!`, timestamp: Date.now() });
    } catch (e) {}
  };

  return (
    <AppContext.Provider value={{ 
      tasks, stars, hugs, alerts, waterConsumed, gratitudeNotes, 
      addTask, sendHug, completeTask, triggerSOS, clearAlerts, 
      logWater, addGratitude, requestCall 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
