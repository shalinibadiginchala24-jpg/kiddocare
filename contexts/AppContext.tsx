import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  alerts: Alert[];
  addTask: (title: string) => void;
  completeTask: (id: string) => void;
  triggerSOS: () => void;
  clearAlerts: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stars, setStars] = useState(0);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('kiddocare_tasks');
        const storedStars = await AsyncStorage.getItem('kiddocare_stars');
        const storedAlerts = await AsyncStorage.getItem('kiddocare_alerts');

        if (storedTasks) setTasks(JSON.parse(storedTasks));
        if (storedStars) setStars(JSON.parse(storedStars));
        if (storedAlerts) setAlerts(JSON.parse(storedAlerts));
      } catch (e) {
        console.error('Failed to load data', e);
      } finally {
        setIsLoaded(true);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem('kiddocare_tasks', JSON.stringify(tasks));
      AsyncStorage.setItem('kiddocare_stars', JSON.stringify(stars));
      AsyncStorage.setItem('kiddocare_alerts', JSON.stringify(alerts));
    }
  }, [tasks, stars, alerts, isLoaded]);

  const addTask = (title: string) => {
    setTasks([...tasks, { id: Date.now().toString(), title, completed: false }]);
  };

  const completeTask = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id && !task.completed) {
        setStars(s => s + 1); // Reward a star instantly
        return { ...task, completed: true };
      }
      return task;
    }));
  };

  const triggerSOS = () => {
    setAlerts([{ id: Date.now().toString(), message: '🚨 SOS Alert from Child!', timestamp: Date.now() }, ...alerts]);
  };

  const clearAlerts = () => {
    setAlerts([]);
  };

  return (
    <AppContext.Provider value={{ tasks, stars, alerts, addTask, completeTask, triggerSOS, clearAlerts }}>
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
