import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { taskService } from '@/services/taskService';
import { alertService } from '@/services/alertService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';

// ── Pressable Scale Component ────────────────────────────────────────────────
function PressableScale({ onPress, children, style }: any) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={() => { scale.value = withSpring(0.95, { damping: 15, stiffness: 150 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 15, stiffness: 150 }); }}
      onPress={onPress}
    >
      <Animated.View style={[style, animStyle]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

export default function ChildTasks() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    const load = async () => {
      const id = await AsyncStorage.getItem('childId');
      if (!id) return;
      unsub = taskService.subscribeToChildTasks(id, setTasks);
    };
    load();
    return () => { if (unsub) unsub(); };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return ['#B5EAD7', '#98FB98'];
      case 'in-progress': return ['#FFF9C4', '#FFF176'];
      default: return ['#B2E2F2', '#A1C4FD'];
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'completed': return '#2F5233';
      case 'in-progress': return '#5D4037';
      default: return '#0D47A1';
    }
  };

  const handleUpdateStatus = async (taskId: string, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      await taskService.updateTaskStatus(taskId, nextStatus as any);

      if (nextStatus === 'completed') {
        const id = await AsyncStorage.getItem('childId');
        const name = await AsyncStorage.getItem('childName') || 'Your child';
        const taskObj = tasks.find(t => t.taskId === taskId);
        if (id) {
          await alertService.addAlert(id, `🎯 MISSION DONE: ${name} completed "${taskObj?.title || 'a task'}" successfully.`, 'info');
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient 
        colors={['#FFE4E6', '#FFD1DC']} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }} 
        style={styles.header}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>My Missions 🚀</Text>
          <Text style={styles.sub}>Complete tasks to earn amazing rewards!</Text>
        </View>
      </LinearGradient>
      
      <ScrollView contentContainerStyle={styles.scroll}>
        {tasks.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTxt}>No missions yet! Check back soon. ✨</Text>
          </View>
        ) : (
          tasks.map((task, i) => (
            <Animated.View key={task.taskId} entering={FadeInDown.delay(i * 100).duration(600).springify()}>
              <PressableScale 
                style={styles.card} 
                onPress={() => handleUpdateStatus(task.taskId, task.status)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconBox}>
                    <MaterialIcons 
                      name={task.status === 'completed' ? "check-box" : "check-box-outline-blank"} 
                      size={24} 
                      color="#FF6B6B" 
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <Text style={[styles.taskTitle, task.status === 'completed' && styles.completedText]}>
                      {task.title}
                    </Text>
                    <Text style={styles.points}>⭐ {task.points || 10} Stars</Text>
                  </View>
                  <LinearGradient colors={getStatusColor(task.status) as any} style={styles.statusBadge}>
                    <Text style={[styles.statusTxt, { color: getStatusTextColor(task.status) }]}>
                      {task.status}
                    </Text>
                  </LinearGradient>
                </View>
                {task.description && <Text style={styles.desc}>{task.description}</Text>}
              </PressableScale>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  title: { fontSize: 32, fontWeight: '900', color: '#4A4A4A' },
  sub: { fontSize: 16, color: '#6B7280', marginTop: 6, fontWeight: '600' },
  scroll: { padding: 20, paddingBottom: 100 },
  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 16, elevation: 0, shadowOpacity: 0.05, shadowRadius: 15, shadowOffset: { width: 0, height: 10 }, borderWidth: 1, borderColor: '#F3F4F6' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  iconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#FFE4E6', justifyContent: 'center', alignItems: 'center' },
  taskTitle: { fontSize: 17, fontWeight: '900', color: '#4A4A4A' },
  completedText: { textDecorationLine: 'line-through', color: '#9CA3AF' },
  points: { fontSize: 13, color: '#FF6B6B', fontWeight: '800', marginTop: 2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusTxt: { fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  desc: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginLeft: 63, fontWeight: '500' },
  empty: { padding: 40, alignItems: 'center' },
  emptyTxt: { fontSize: 16, color: '#9CA3AF', textAlign: 'center', fontWeight: '600' }
});
