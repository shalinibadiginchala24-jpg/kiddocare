import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn, ZoomInUp } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ChildScreenTime() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#4ADE80', '#22C55E']}
        style={styles.header}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Play Time 🎮</Text>
      </LinearGradient>

      <View style={styles.timerArea}>
        <Animated.View entering={ZoomInUp.duration(1000)} style={styles.timerCircle}>
            <View style={styles.timerInner}>
                <Text style={styles.timeLeftLabel}>Time Left</Text>
                <Text style={styles.timeValue}>01:20</Text>
                <Text style={styles.timeUnit}>Hours</Text>
            </View>
            <View style={styles.timerProgress}>
                <View style={[styles.timerBar, { height: '60%' }]} />
            </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600)} style={styles.tipBox}>
            <Ionicons name="bulb-outline" size={24} color="#15803D" />
            <Text style={styles.tipText}>Taking a 5-minute break every hour keeps your eyes happy! 👀</Text>
        </Animated.View>
      </View>

      <View style={styles.statsBox}>
         <Text style={styles.statsTitle}>{"Today's Achievements"}</Text>
         <View style={styles.statsRow}>
            <View style={styles.statCard}>
                <Text style={styles.statEmoji}>⏱️</Text>
                <Text style={styles.statVal}>3h 40m</Text>
                <Text style={styles.statLbl}>Played</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statEmoji}>🧘</Text>
                <Text style={styles.statVal}>2 Breaks</Text>
                <Text style={styles.statLbl}>Taken</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statEmoji}>⭐</Text>
                <Text style={styles.statVal}>+10 Stars</Text>
                <Text style={styles.statLbl}>Earned</Text>
            </View>
         </View>

         <TouchableOpacity style={styles.breakBtn}>
            <LinearGradient
                colors={['#4ADE80', '#16A34A']}
                style={styles.btnGradient}
            >
                <Text style={styles.btnText}>Take a Smart Break 🧊</Text>
            </LinearGradient>
         </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0FDF4' },
  header: { 
      paddingTop: 60, 
      paddingBottom: 30, 
      paddingHorizontal: 24, 
      flexDirection: 'row', 
      alignItems: 'center',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 20
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: '#FFF', flex: 1, textAlign: 'center', marginRight: 40 },
  timerArea: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  timerCircle: { 
      width: 250, 
      height: 250, 
      borderRadius: 125, 
      backgroundColor: '#FFF', 
      justifyContent: 'center', 
      alignItems: 'center',
      elevation: 8,
      shadowOpacity: 0.1,
      shadowRadius: 15,
      position: 'relative',
      overflow: 'hidden'
  },
  timerInner: { zIndex: 10, alignItems: 'center' },
  timeLeftLabel: { fontSize: 14, fontWeight: '700', color: '#86EFAC' },
  timeValue: { fontSize: 48, fontWeight: '900', color: '#16A34A', marginVertical: 4 },
  timeUnit: { fontSize: 16, fontWeight: '700', color: '#16A34A' },
  timerProgress: { position: 'absolute', bottom: 0, width: '100%', height: '100%', backgroundColor: '#F0FDF4', opacity: 0.5 },
  timerBar: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#86EFAC' },
  tipBox: { 
      marginTop: 40, 
      backgroundColor: '#DCFCE7', 
      padding: 16, 
      borderRadius: 20, 
      flexDirection: 'row', 
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#86EFAC'
  },
  tipText: { flex: 1, marginLeft: 12, fontSize: 13, color: '#15803D', fontWeight: '600' },
  statsBox: { padding: 24, paddingBottom: 40 },
  statsTitle: { fontSize: 18, fontWeight: '900', color: '#1F2937', marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCard: { 
      backgroundColor: '#FFF', 
      borderRadius: 16, 
      padding: 12, 
      width: '31%', 
      alignItems: 'center',
      elevation: 2,
      shadowOpacity: 0.05,
      shadowRadius: 5
  },
  statEmoji: { fontSize: 24, marginBottom: 4 },
  statVal: { fontSize: 14, fontWeight: '800', color: '#1F2937' },
  statLbl: { fontSize: 10, color: '#9CA3AF', fontWeight: '700', marginTop: 2 },
  breakBtn: { height: 56, borderRadius: 18, overflow: 'hidden' },
  btnGradient: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#FFF', fontSize: 18, fontWeight: '800' }
});
