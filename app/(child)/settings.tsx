import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '@/services/authService';

export default function ChildSettings() {
  const router = useRouter();
  const [helpVisible, setHelpVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const [avatar, setAvatar] = useState('🧒');
  const [childName, setChildName] = useState('Adventurer');
  const [sosSent, setSosSent] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('childAvatar').then(a => { if (a) setAvatar(a); });
    AsyncStorage.getItem('childName').then(n => { if (n) setChildName(n); });
    AsyncStorage.getItem('sos_sent_status').then(s => { if (s === 'true') setSosSent(true); });
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout('child');
      router.replace('/login');
    } catch (e) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const settingsItems = [
    { label: 'Help & Support', icon: 'help-circle', color: '#3B82F6', action: () => setHelpVisible(true) },
    { label: 'Privacy Policy', icon: 'shield-lock', color: '#10B981', action: () => setPrivacyVisible(true) },
    { label: 'Log Out', icon: 'logout', color: '#EF4444', action: handleLogout },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#EC4899', '#F472B6']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 44 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.profileSection}>
            <View style={styles.avatarCircle}>
                <Text style={{ fontSize: 40 }}>{avatar}</Text>
            </View>
            <Text style={styles.profileName}>{childName}</Text>
            <Text style={styles.profileSub}>KiddoCare Adventurer</Text>
            {sosSent && (
              <View style={styles.sosBadge}>
                <Ionicons name="alert-circle" size={16} color="#FFF" />
                <Text style={styles.sosBadgeTxt}>SOS Sent - Help Notified</Text>
              </View>
            )}
        </Animated.View>

        <View style={styles.section}>
            {settingsItems.map((item, i) => (
                <Animated.View key={item.label} entering={FadeInDown.delay(200 + i * 100)}>
                    <TouchableOpacity style={styles.settingItem} onPress={item.action}>
                        <View style={[styles.iconBox, { backgroundColor: item.color + '15' }]}>
                            <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
                        </View>
                        <Text style={styles.settingLabel}>{item.label}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
                    </TouchableOpacity>
                </Animated.View>
            ))}
        </View>
        
        <Text style={styles.footerText}>Made with ❤️ for Kids</Text>
      </ScrollView>

      {/* Help Modal */}
      <Modal transparent visible={helpVisible} animationType="fade" onRequestClose={() => setHelpVisible(false)}>
        <View style={styles.overlay}>
          <Animated.View entering={ZoomIn.duration(300)} style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Help & Support 💡</Text>
              <TouchableOpacity onPress={() => setHelpVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.helpHeading}>🎮 How do I play games?</Text>
              <Text style={styles.helpText}>Go back to your main screen and find the &quot;My Fun Zone&quot; section. Tap &quot;Games&quot; to explore!</Text>

              <Text style={styles.helpHeading}>⭐ How do I earn Stars?</Text>
              <Text style={styles.helpText}>Complete the daily missions that your mom and dad assign to you. Each mission holds secret rewards!</Text>

              <Text style={styles.helpHeading}>🚨 When do I use the SOS button?</Text>
              <Text style={styles.helpText}>Only push the red button if you are lost, scared, or need immediate help. Your parents get alerted.</Text>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

      {/* Privacy Modal */}
      <Modal transparent visible={privacyVisible} animationType="fade" onRequestClose={() => setPrivacyVisible(false)}>
        <View style={styles.overlay}>
          <Animated.View entering={ZoomIn.duration(300)} style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Policy 🛡️</Text>
              <TouchableOpacity onPress={() => setPrivacyVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#4B5563" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.helpHeading}>🔐 Your Data is Safe</Text>
              <Text style={styles.helpText}>We secure everything tightly. No strangers can read about your gaming activity ever.</Text>

              <Text style={styles.helpHeading}>👩‍👧 Parent Access Only</Text>
              <Text style={styles.helpText}>Reports regarding screen-time tracking sync solely between registered family devices safely.</Text>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { 
      paddingTop: 60, 
      paddingBottom: 24, 
      paddingHorizontal: 20, 
      flexDirection: 'row', 
      alignItems: 'center',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30
  },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '900', color: '#FFF', flex: 1, textAlign: 'center' },
  content: { padding: 24 },
  profileSection: { alignItems: 'center', marginBottom: 40 },
  avatarCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#FCE7F3', justifyContent: 'center', alignItems: 'center', marginBottom: 16, elevation: 4, shadowOpacity: 0.1, shadowRadius: 10 },
  profileName: { fontSize: 22, fontWeight: '900', color: '#1F2937' },
  profileSub: { fontSize: 14, color: '#9CA3AF', marginTop: 4, fontWeight: '600' },
  section: { backgroundColor: '#F8FAFC', borderRadius: 24, padding: 8 },
  settingItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 20, borderRadius: 20, marginBottom: 12, elevation: 2, shadowOpacity: 0.05, shadowRadius: 10 },
  iconBox: { width: 44, height: 44, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  settingLabel: { flex: 1, fontSize: 16, fontWeight: '800', color: '#4A4A4A', marginLeft: 16 },
  sosBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EF4444', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginTop: 12, gap: 6 },
  sosBadgeTxt: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  footerText: { textAlign: 'center', color: '#CBD5E1', fontSize: 12, marginTop: 40, fontWeight: '800' },

  // Modals
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { backgroundColor: '#FFF', borderRadius: 32, width: '100%', maxWidth: 400, maxHeight: '80%', overflow: 'hidden', elevation: 5, shadowOpacity: 0.15, shadowRadius: 15 },
  modalHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#1F2937' },
  modalBody: { padding: 20 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.05)', justifyContent: 'center', alignItems: 'center' },
  helpHeading: { fontSize: 16, fontWeight: '800', color: '#1F2937', marginTop: 15, marginBottom: 5 },
  helpText: { fontSize: 14, color: '#6B7280', lineHeight: 20, fontWeight: '500', marginBottom: 10 }
});
