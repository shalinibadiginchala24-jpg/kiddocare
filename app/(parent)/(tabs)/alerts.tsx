import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { alertService } from '@/services/alertService';
import { childService } from '@/services/childService';
import AlertCard from '@/components/AlertCard';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const pid = await AsyncStorage.getItem('parentId');
        if (pid) {
          const kids = await childService.getChildrenByParent(pid);
          if (kids.length > 0) {
            const data = await alertService.getAlerts(kids[0].id);
            setAlerts(data);
          }
        }
      } catch (e) {
        console.error('Error fetching alerts', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7B61FF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.title}>Safety Portal 🛡️</Text>
      
      {alerts.length > 0 ? (
        alerts.map((al, index) => (
          <Animated.View key={al.id} entering={FadeInDown.delay(index * 100)}>
             <AlertCard 
                title={al.type === 'danger' ? 'Critical Alert' : 'Information'}
                message={al.message}
                type={al.type}
                time={new Date(al.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             />
          </Animated.View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="checkmark-done-circle-outline" size={80} color="#10B981" />
          <Text style={styles.emptyText}>All Quiet! No alerts detected.</Text>
          <Text style={styles.emptySub}>Your child is safe and monitoring is active.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  scrollContent: { padding: 24, paddingBottom: 100 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '900', color: '#1F2937', marginBottom: 24 },
  emptyState: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyText: { fontSize: 20, fontWeight: '800', color: '#1F2937', marginTop: 16, textAlign: 'center' },
  emptySub: { fontSize: 15, color: '#6B7280', textAlign: 'center', marginTop: 8 }
});
