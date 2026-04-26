import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { childService } from '@/services/childService';
import { taskService } from '@/services/taskService';

const CHILD_PALETTES = [
  { bg: ['#FFD1DC', '#FFB7C5'] as const, chipBg: '#FFF0F4', dot: '#FF6B9D' },
  { bg: ['#B5EAD7', '#98FB98'] as const, chipBg: '#F0FFF8', dot: '#6BCB77' },
  { bg: ['#C7CEEA', '#E2D1F9'] as const, chipBg: '#F5F0FF', dot: '#9B87F5' },
  { bg: ['#FFDAC1', '#FFB347'] as const, chipBg: '#FFF8F0', dot: '#FF9F43' },
  { bg: ['#B2E2F2', '#A1C4FD'] as const, chipBg: '#F0F8FF', dot: '#4D96FF' },
  { bg: ['#FFF9C4', '#FFF176'] as const, chipBg: '#FFFFF0', dot: '#F9CA24' },
];

export default function ParentTasks() {
  const [parentId, setParentId] = useState<string | null>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const init = async () => {
      const pid = await AsyncStorage.getItem('parentId');
      if (pid) {
        setParentId(pid);
        const kids = await childService.getChildrenByParent(pid);
        setChildren(kids);
        if (kids.length > 0) {
          setSelectedChildId(kids[0].id);
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    if (selectedChildId) {
       unsub = taskService.subscribeToChildTasks(selectedChildId, setTasks);
    }
    return () => { if (unsub) unsub(); };
  }, [selectedChildId]);

  const handleAddTask = async () => {
    if (newTaskTitle.trim() && selectedChildId && parentId) {
      setIsAdding(true);
      await taskService.createTask(newTaskTitle.trim(), selectedChildId, parentId);
      setNewTaskTitle('');
      setIsAdding(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Assigned Tasks</Text>

      {/* Child Selector */}
      <View style={styles.selectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {children.map((c, i) => {
            const palette = CHILD_PALETTES[i % CHILD_PALETTES.length];
            const isActive = selectedChildId === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.childChip,
                  { backgroundColor: isActive ? palette.chipBg : '#FFF', borderColor: isActive ? palette.dot : '#E5E7EB', borderWidth: 2 },
                ]}
                onPress={() => setSelectedChildId(c.id)}
              >
                <View style={[styles.childAvatar, { backgroundColor: palette.dot }]}>
                  <Text style={styles.childAvatarText}>
                    {c.name?.[0]?.toUpperCase() || "?"}
                  </Text>
                </View>
                <Text style={[styles.childChipText, isActive && { color: palette.dot, fontWeight: '900' }]}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={selectedChildId ? "e.g. Clean up toys" : "Loading..."}
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          editable={!!selectedChildId}
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask} disabled={isAdding || !selectedChildId}>
          {isAdding ? <ActivityIndicator color="#FFF" size="small" /> : <MaterialIcons name="add" size={24} color="#FFF" />}
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.taskId}
        renderItem={({ item }) => {
          const isCompleted = item.status === 'completed';
          return (
            <View style={styles.taskCard}>
              <View>
                <Text style={styles.taskTitle}>{item.title}</Text>
                <Text style={styles.taskStatus}>{isCompleted ? 'Completed' : 'Pending'}</Text>
              </View>
              <MaterialIcons 
                name={isCompleted ? "check-circle" : "radio-button-unchecked"} 
                size={28} 
                color={isCompleted ? "#34C759" : "#C7C7CC"} 
              />
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.emptyText}>{selectedChildId ? 'No tasks created yet.' : 'Please add a child first.'}</Text>}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  selectorContainer: {
    marginBottom: 20,
  },
  childChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  childAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  childAvatarText: { 
    fontSize: 12, 
    fontWeight: "900", 
    color: "#FFF" 
  },
  childChipText: { 
    fontSize: 14, 
    fontWeight: "700", 
    color: "#6B7280" 
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  addButton: {
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    width: 55,
    borderRadius: 10,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  taskStatus: {
    fontSize: 14,
    color: '#888',
  },
  emptyText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
});
