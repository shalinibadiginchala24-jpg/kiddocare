import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInLeft, Layout, ZoomInEasyDown } from 'react-native-reanimated';
import { KID_COLORS } from '@/constants/kidColors';

type TaskCardProps = {
  item: { id: string; title: string; completed: boolean };
  index: number;
  onComplete: (id: string) => void;
};

export default function TaskCard({ item, index, onComplete }: TaskCardProps) {
  return (
    <Animated.View 
      entering={FadeInLeft.delay(index * 200).duration(1000).springify().damping(14)}
      layout={Layout.springify().damping(12).mass(0.8)}
    >
      <TouchableOpacity 
        style={[styles.taskCard, item.completed && styles.taskCompleted]}
        onPress={() => !item.completed && onComplete(item.id)}
        disabled={item.completed}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {item.completed ? (
            <Animated.View entering={ZoomInEasyDown.springify()}>
              <MaterialIcons name="check-circle" size={36} color={KID_COLORS.completed} style={{ marginRight: 15 }} />
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
  );
}

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: KID_COLORS.home,
    padding: 25,
    borderRadius: 30, 
    marginBottom: 15,
    shadowColor: KID_COLORS.home,
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
  },
  taskCompleted: {
    backgroundColor: KID_COLORS.success,
    shadowColor: KID_COLORS.success,
  },
  emptyCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: KID_COLORS.primary,
    marginRight: 15,
  },
  taskText: {
    fontSize: 22,
    color: KID_COLORS.textPrimary,
    fontWeight: 'bold',
  },
  taskTextCompleted: {
    color: KID_COLORS.completed,
    textDecorationLine: 'line-through',
  },
});
