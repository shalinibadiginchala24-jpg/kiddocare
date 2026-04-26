import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { alertService } from '@/services/alertService';

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

export default function ChildSOS() {
  const [childId, setChildId] = useState<string | null>(null);
  const [sosSent, setSosSent] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('childId').then(id => {
      setChildId(id);
    });
    AsyncStorage.getItem('sos_sent_status').then(status => {
      if (status === 'true') {
        setSosSent(true);
      }
    });
  }, []);

  const handleSOS = async () => {
    try {
      if (childId) {
        await alertService.addAlert(childId, '🆘 CHILD INITIATED SOS ALERT!!', 'danger');
        await AsyncStorage.setItem('sos_sent_status', 'true');
        setSosSent(true);
      }
      Alert.alert(
        '🚨 SOS Alert Sent!',
        'Your parent has been notified immediately. Stay calm and in a safe place.',
        [{ text: 'OK', style: 'default' }]
      );
    } catch (e: any) {
      console.error(e);
      Alert.alert('Error', 'Could not send alert, try again or call for help!');
    }
  };

  const handleResetSOS = async () => {
    await AsyncStorage.removeItem('sos_sent_status');
    setSosSent(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={['#FFD1DC', '#FFB7C5']}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.title}>Safety SOS 🚨</Text>
        <Text style={styles.sub}>Press the button below if you need help!</Text>
      </LinearGradient>

      <View style={styles.body}>
        <Animated.View entering={FadeInDown.delay(200).duration(600).springify()} style={styles.infoCard}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-checkmark" size={32} color="#FF6B6B" />
          </View>
          <Text style={styles.infoTitle}>You are Safe 🛡️</Text>
          <Text style={styles.infoText}>
            This button sends an instant alert to your parent. Only press it in a real emergency!
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(600).springify()} style={styles.sosWrapper}>
          {sosSent ? (
            <View style={styles.sentWrapper}>
              <LinearGradient colors={['#10B981', '#059669']} style={styles.sosBtn}>
                <Ionicons name="checkmark-circle" size={60} color="#FFF" />
                <Text style={styles.sosTxt}>SENT</Text>
                <Text style={styles.sosSub}>Help is on the way</Text>
              </LinearGradient>
              <TouchableOpacity onPress={handleResetSOS} style={styles.resetBtn}>
                <Text style={styles.resetTxt}>Reset SOS Status</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <PressableScale onPress={handleSOS}>
              <LinearGradient colors={['#FF8A8A', '#FF4D4D']} style={styles.sosBtn}>
                <Ionicons name="alert-circle" size={60} color="#FFF" />
                <Text style={styles.sosTxt}>HELP ME</Text>
                <Text style={styles.sosSub}>Tap in Emergency</Text>
              </LinearGradient>
            </PressableScale>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).duration(600).springify()} style={styles.tipsCard}>
          <Text style={styles.tipsTitle}>Safety Tips 💡</Text>
          {['Stay in public places', 'Talk to trusted adults', 'Never share your PIN', 'Tell parents where you are'].map((tip, i) => (
            <View key={i} style={styles.tipRow}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  title: { fontSize: 32, fontWeight: '900', color: '#4A4A4A' },
  sub: { fontSize: 16, color: '#6B7280', marginTop: 6, fontWeight: '600' },
  body: { flex: 1, padding: 20 },
  infoCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 20, elevation: 0, shadowOpacity: 0.05, shadowRadius: 15, shadowOffset: { width: 0, height: 10 }, borderWidth: 1, borderColor: '#F3F4F6' },
  iconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFE4E6', justifyContent: 'center', alignItems: 'center' },
  infoTitle: { fontSize: 20, fontWeight: '900', color: '#4A4A4A', marginTop: 12 },
  infoText: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginTop: 8, lineHeight: 22, fontWeight: '500' },
  sosWrapper: { alignItems: 'center', marginBottom: 20 },
  sosBtn: { width: 180, height: 180, borderRadius: 90, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#FF4D4D', shadowOpacity: 0.3, shadowRadius: 20 },
  sosTxt: { color: '#FFF', fontSize: 22, fontWeight: '900', marginTop: 6 },
  sosSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 4, fontWeight: '600' },
  tipsCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, elevation: 0, shadowOpacity: 0.05, shadowRadius: 15, shadowOffset: { width: 0, height: 10 }, borderWidth: 1, borderColor: '#F3F4F6' },
  tipsTitle: { fontSize: 17, fontWeight: '900', color: '#4A4A4A', marginBottom: 14 },
  tipRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  tipText: { fontSize: 15, color: '#6B7280', marginLeft: 10, fontWeight: '600' },
  sentWrapper: { alignItems: 'center' },
  resetBtn: { marginTop: 20, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#F3F4F6', borderRadius: 20 },
  resetTxt: { color: '#6B7280', fontWeight: 'bold' }
});
