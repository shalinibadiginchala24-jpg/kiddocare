import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Dummy Activity Data (In a real app, this would come from Firebase)
const DUMMY_ACTIVITIES = [
  { id: '1', title: 'Completed "Brush Teeth"', time: '10 mins ago', type: 'task' },
  { id: '2', title: 'Played "Coloring"', time: '2 hours ago', type: 'game' },
  { id: '3', title: 'Read "The Lion & Mouse"', time: 'Yesterday', type: 'story' },
  { id: '4', title: 'Completed "Clean Room"', time: 'Yesterday', type: 'task' },
];

export default function ActivityScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Recent Activity 📈</Text>
      
      <View style={styles.timeline}>
        {DUMMY_ACTIVITIES.map((activity, index) => (
          <Animated.View 
            key={activity.id} 
            entering={FadeInDown.delay(index * 100)}
            style={styles.activityItem}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons 
                name={activity.type === 'task' ? 'check-circle' : activity.type === 'game' ? 'color-lens' : 'menu-book'} 
                size={24} 
                color="#7B61FF" 
              />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          </Animated.View>
        ))}
      </View>

      <View style={styles.card}>
        <Ionicons name="stats-chart" size={32} color="#7B61FF" />
        <Text style={styles.cardTitle}>Stats Summary</Text>
        <Text style={styles.cardText}>
          Your child is 20% more active this week compared to last week! Excellent progress.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 32,
  },
  timeline: {
    borderLeftWidth: 2,
    borderLeftColor: '#E5E7EB',
    marginLeft: 12,
    paddingLeft: 24,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 32,
    position: 'relative',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F0FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: -46,
    borderWidth: 4,
    borderColor: '#F9FAFB',
  },
  activityContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  activityTitle: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '700',
  },
  activityTime: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  card: {
    marginTop: 10,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 12,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  }
});
