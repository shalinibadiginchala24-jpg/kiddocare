import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ScreenTimeManagement() {
  const router = useRouter();
  const [isPaused, setIsPaused] = useState(false);

  const usageData = [
    { app: 'YouTube', time: '1h 20m', icon: 'youtube', color: '#FF0000' },
    { app: 'Roblox', time: '45m', icon: 'gamepad', color: '#000000' },
    { app: 'Education', time: '1h 05m', icon: 'book', color: '#10B981' },
    { app: 'TikTok', time: '30m', icon: 'video', color: '#EEE' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#0F172A', '#1E293B']}
        style={styles.header}
      >
        <View style={styles.headerNav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Screen Time</Text>
          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons name="options-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <Animated.View entering={ZoomIn.duration(600)} style={styles.totalUsageCard}>
          <Text style={styles.usageLabel}>Total Usage Today</Text>
          <Text style={styles.usageTime}>3h 40m</Text>
          <View style={styles.limitBar}>
            <View style={[styles.limitFill, { width: '70%' }]} />
          </View>
          <Text style={styles.limitText}>70% of 5h Daily Limit used</Text>
        </Animated.View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Remote Control */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.controlCard}>
          <View style={styles.controlInfo}>
            <View style={[styles.controlIcon, { backgroundColor: isPaused ? '#FEE2E2' : '#DBEAFE' }]}>
               <Ionicons 
                name={isPaused ? "pause-circle" : "play-circle"} 
                size={30} 
                color={isPaused ? "#EF4444" : "#2563EB"} 
               />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.controlTitle}>{isPaused ? "Device Paused" : "Device Active"}</Text>
              <Text style={styles.controlSub}>{isPaused ? "Apps are temporarily locked" : "Child is using YouTube"}</Text>
            </View>
            <Switch 
              value={isPaused} 
              onValueChange={setIsPaused}
              trackColor={{ false: "#D1D5DB", true: "#EF4444" }}
              thumbColor={isPaused ? "#FFF" : "#FFF"}
            />
          </View>
        </Animated.View>

        {/* App Insights */}
        <Text style={styles.sectionTitle}>App Usage Insights</Text>
        {usageData.map((item, index) => (
          <Animated.View 
            key={item.app} 
            entering={FadeInDown.delay(300 + index * 100)} 
            style={styles.usageItem}
          >
            <View style={[styles.appIcon, { backgroundColor: '#F3F4F6' }]}>
               <FontAwesome5 name={item.icon} size={20} color={item.color} />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.appName}>{item.app}</Text>
              <View style={styles.appProgressBg}>
                 <View style={[styles.appProgressFill, { width: index === 0 ? '80%' : index === 1 ? '50%' : '40%', backgroundColor: item.color }]} />
              </View>
            </View>
            <Text style={styles.appTime}>{item.time}</Text>
          </Animated.View>
        ))}

        {/* Settings Shortcut */}
        <Animated.View entering={FadeInUp.delay(800)} style={styles.settingsGrid}>
            <TouchableOpacity style={styles.settingCard}>
                <Ionicons name="time" size={24} color="#7C3AED" />
                <Text style={styles.settingLabel}>App Limits</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingCard}>
                <Ionicons name="moon" size={24} color="#3B82F6" />
                <Text style={styles.settingLabel}>Downtime</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingCard}>
                <Ionicons name="shield-checkmark" size={24} color="#10B981" />
                <Text style={styles.settingLabel}>Restrictions</Text>
            </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    paddingTop: 60, 
    paddingBottom: 40, 
    paddingHorizontal: 24,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  headerNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  settingsBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  totalUsageCard: {
    alignItems: 'center',
    paddingBottom: 10
  },
  usageLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '600' },
  usageTime: { color: '#FFF', fontSize: 44, fontWeight: '900', marginVertical: 8 },
  limitBar: {
    height: 6,
    width: '80%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 10
  },
  limitFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3
  },
  limitText: { color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: '600', marginTop: 12 },
  scrollContent: { padding: 24, paddingBottom: 120 },
  controlCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    elevation: 4,
    shadowColor: '#64748B',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 32,
    marginTop: -20
  },
  controlInfo: { flexDirection: 'row', alignItems: 'center' },
  controlIcon: { width: 56, height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  controlTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
  controlSub: { fontSize: 13, color: '#64748B', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 20 },
  usageItem: { 
      flexDirection: 'row', 
      alignItems: 'center', 
      backgroundColor: '#FFF', 
      padding: 16, 
      borderRadius: 20, 
      marginBottom: 12,
      elevation: 2,
      shadowOpacity: 0.05,
      shadowRadius: 5
  },
  appIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  appName: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  appProgressBg: { height: 4, backgroundColor: '#F1F5F9', borderRadius: 2, marginTop: 8, width: '100%' },
  appProgressFill: { height: '100%', borderRadius: 2 },
  appTime: { fontSize: 14, fontWeight: '700', color: '#475569', marginLeft: 12 },
  settingsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  settingCard: {
      backgroundColor: '#FFF',
      borderRadius: 20,
      padding: 16,
      width: '31%',
      alignItems: 'center',
      elevation: 2,
      shadowOpacity: 0.05,
      shadowRadius: 5
  },
  settingLabel: { fontSize: 12, fontWeight: '700', color: '#475569', marginTop: 10 }
});
