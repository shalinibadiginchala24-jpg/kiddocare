import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '@/contexts/AppContext';
import Animated, { FadeInLeft, Layout, ZoomInEasyDown } from 'react-native-reanimated';

export default function ChildTasks() {
  const { tasks, completeTask } = useAppContext();

  const displayTasks = [...tasks].sort((a, b) => Number(a.completed) - Number(b.completed));

  return (
    <View style={styles.container}>
      <Animated.Text entering={ZoomInEasyDown.duration(1200)} style={styles.title}>
        Things To Do! 🫧
      </Animated.Text>

      <FlatList
        data={displayTasks}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <Animated.View 
            entering={FadeInLeft.delay(index * 200).duration(1000).springify().damping(14)}
            layout={Layout.springify().damping(12).mass(0.8)}
          >
            <TouchableOpacity 
              style={[styles.taskCard, item.completed && styles.taskCompleted]}
              onPress={() => !item.completed && completeTask(item.id)}
              disabled={item.completed}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {item.completed ? (
                  <Animated.View entering={ZoomInEasyDown.springify()}>
                    <MaterialIcons name="star" size={36} color="#FFD700" style={{ marginRight: 15 }} />
                  </Animated.View>
                ) : (
                  <View style={styles.emptyCircle} />
                )}
                <Text style={[styles.taskText, item.completed && styles.taskTextCompleted]}>
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
        ListEmptyComponent={
          <Animated.Text entering={FadeInLeft.delay(400)} style={styles.emptyText}>
            Yay! No tasks right now! 🎉
          </Animated.Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#AEC6CF', // Soft baby blue heading
    marginBottom: 20,
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: '#E6E6FA', // Soft Lavender
    padding: 25,
    borderRadius: 30, 
    marginBottom: 15,
    shadowColor: '#E6E6FA',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
  },
  taskCompleted: {
    backgroundColor: '#FFF8D6', // Soft pale yellow instead of mint
    shadowColor: '#FFF8D6',
  },
  emptyCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#FFF',
    marginRight: 15,
  },
  taskText: {
    fontSize: 22,
    color: '#333',
    fontWeight: 'bold',
  },
  taskTextCompleted: {
    color: '#BDBDBD',
    textDecorationLine: 'line-through',
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});
