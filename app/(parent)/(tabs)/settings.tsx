import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '@/services/authService';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

const SETTINGS_OPTIONS = [
  { id: '1', title: 'Account Profile', icon: 'person-outline', color: '#7B61FF' },
  { id: '2', title: 'Subscription Plan', icon: 'card-outline', color: '#F59E0B' },
  { id: '3', title: 'Security & PIN', icon: 'shield-outline', color: '#10B981' },
  { id: '4', title: 'Help & Support', icon: 'help-circle-outline', color: '#3B82F6' },
];

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.replace('/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.Text 
        entering={FadeInDown.duration(600).springify()} 
        style={styles.title}
      >
        Settings ⚙️
      </Animated.Text>
      
      <View style={styles.section}>
        {SETTINGS_OPTIONS.map((opt, index) => (
          <Animated.View 
            key={opt.id} 
            entering={FadeInDown.delay(index * 120).duration(600).springify()}
          >
            <TouchableOpacity 
              activeOpacity={0.7} 
              style={[
                styles.optionItem,
                index === SETTINGS_OPTIONS.length - 1 && { borderBottomWidth: 0 }
              ]}
              onPress={() => Alert.alert(opt.title, `Configure your ${opt.title} in the portal.`)}
            >
              <View style={[styles.iconBox, { backgroundColor: `${opt.color}15` }]}>
                <Ionicons name={opt.icon as any} size={22} color={opt.color} />
              </View>
              <Text style={styles.optionTitle}>{opt.title}</Text>
              <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      <Animated.View entering={FadeInDown.delay(600).duration(800).springify()}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out Account</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.version}>KiddoCare Version 1.0.4 PRO</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
  scrollContent: { 
    padding: 24, 
    paddingBottom: 40 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#1F2937', 
    marginBottom: 32,
    marginTop: Platform.OS === 'ios' ? 20 : 0
  },
  section: { 
    backgroundColor: '#FFF', 
    borderRadius: 24, 
    paddingVertical: 8, 
    paddingHorizontal: 4,
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowOffset: { width: 0, height: 4 }, 
    elevation: 3 
  },
  optionItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#F3F4F6' 
  },
  iconBox: { 
    width: 44, 
    height: 44, 
    borderRadius: 14, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 16 
  },
  optionTitle: { 
    flex: 1, 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#374151' 
  },
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 40, 
    backgroundColor: '#FEF2F2', 
    padding: 18, 
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FEE2E2'
  },
  logoutText: { 
    marginLeft: 10, 
    color: '#EF4444', 
    fontWeight: '800', 
    fontSize: 16 
  },
  version: { 
    textAlign: 'center', 
    marginTop: 40, 
    color: '#9CA3AF', 
    fontSize: 13, 
    fontWeight: '600' 
  }
});

