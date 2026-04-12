import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// Dummy Activity Data
const DUMMY_ACTIVITIES = [
  { id: '1', title: 'Completed "Brush Teeth"', time: '10 mins ago', type: 'task' },
  { id: '2', title: 'Played "Coloring"', time: '2 hours ago', type: 'game' },
  { id: '3', title: 'Read "The Lion & Mouse"', time: 'Yesterday', type: 'story' },
  { id: '4', title: 'Completed "Clean Room"', time: 'Yesterday', type: 'task' },
];

export default function ActivityScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Recent Activity</Text>
      
      <View style={styles.timeline}>
        {DUMMY_ACTIVITIES.map((activity, index) => (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.iconContainer}>
              <MaterialIcons 
                name={activity.type === 'task' ? 'check-circle' : activity.type === 'game' ? 'color-lens' : 'menu-book'} 
                size={24} 
                color="#4A90E2" 
              />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  timeline: {
    borderLeftWidth: 2,
    borderLeftColor: '#E0E0E0',
    marginLeft: 15,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 25,
    marginLeft: -15,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E6F4FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#FAFAFA',
  },
  activityContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  activityTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  activityTime: {
    fontSize: 14,
    color: '#888',
    marginTop: 5,
  },
});
