import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChildSafeAdventure() {
  const router = useRouter();
  const [avatar, setAvatar] = useState('🧒');
  const [childName, setChildName] = useState('Hero');

  useEffect(() => {
    AsyncStorage.getItem('childAvatar').then(a => { if (a) setAvatar(a); });
    AsyncStorage.getItem('childName').then(n => { if (n) setChildName(n); });
  }, []);

  const tips = [
    { id: 1, title: 'Share with Care', desc: 'Always ask your parents before sharing your name or where you live!', icon: 'share-outline', color: '#C44DFF' },
    { id: 2, title: 'Kind Words Only', desc: 'Being a digital superhero means being kind to everyone you meet online!', icon: 'heart-outline', color: '#FF6B9D' },
    { id: 3, title: 'Smart Clicking', desc: "If something looks strange, don't click it! Ask a grown-up first.", icon: 'hand-left-outline', color: '#F59E0B' },
    { id: 4, title: 'Strong Passwords', desc: "Passwords are like secret keys! Keep them safe and don't share them.", icon: 'key-outline', color: '#059669' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient colors={['#EDE9FE', '#DDD6FE']} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#7C3AED" />
        </TouchableOpacity>
        <Text style={styles.title}>Safe Adventure 🛡️</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={ZoomIn.duration(600)} style={styles.heroCard}>
          <LinearGradient colors={['#EDE9FE', '#F5F3FF']} style={styles.heroGradient}>
            <Text style={{ fontSize: 64 }}>{avatar}</Text>
            <Text style={styles.heroTitle}>{childName} is Protected! 🛡️</Text>
            <Text style={styles.heroSub}>KiddoCare keeps your digital world safe and fun.</Text>
          </LinearGradient>
        </Animated.View>

        <Text style={styles.sectionTitle}>Digital Hero Tips</Text>
        
        {tips.map((tip, index) => (
          <Animated.View key={tip.id} entering={FadeInDown.delay(200 + index * 100)} style={styles.tipCard}>
            <View style={[styles.iconBox, { backgroundColor: tip.color + '18' }]}>
              <Ionicons name={tip.icon as any} size={28} color={tip.color} />
            </View>
            <View style={styles.tipInfo}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDesc}>{tip.desc}</Text>
            </View>
          </Animated.View>
        ))}

        <TouchableOpacity style={styles.quizBtn} onPress={() => alert("Safety Quiz coming soon! 🚀")}>
          <LinearGradient colors={['#EDE9FE', '#DDD6FE']} style={styles.quizGradient}>
            <Text style={styles.quizTxt}>Take the Safety Quiz! 🎯</Text>
            <Ionicons name="arrow-forward" size={20} color="#7C3AED" />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9FF' },
  header: { 
      paddingTop: 60, 
      paddingBottom: 30, 
      paddingHorizontal: 24, 
      flexDirection: 'row', 
      alignItems: 'center',
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(124,58,237,0.1)', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: '#5B21B6', flex: 1, textAlign: 'center' },
  scrollContent: { padding: 24, paddingBottom: 60 },
  heroCard: { borderRadius: 30, overflow: 'hidden', marginBottom: 32, elevation: 4, shadowOpacity: 0.08, shadowRadius: 10, shadowColor: '#7C3AED' },
  heroGradient: { padding: 30, alignItems: 'center' },
  heroTitle: { fontSize: 22, fontWeight: '900', color: '#5B21B6', marginTop: 16 },
  heroSub: { fontSize: 14, color: '#7C3AED', textAlign: 'center', marginTop: 8, fontWeight: '600', lineHeight: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#3D1A2A', marginBottom: 20 },
  tipCard: { 
      flexDirection: 'row', 
      backgroundColor: '#FFF', 
      borderRadius: 24, 
      padding: 20, 
      marginBottom: 16,
      alignItems: 'center',
      elevation: 2,
      shadowOpacity: 0.05,
      shadowRadius: 5,
      borderWidth: 1,
      borderColor: '#F3F0FF',
  },
  iconBox: { width: 56, height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  tipInfo: { flex: 1, marginLeft: 16 },
  tipTitle: { fontSize: 17, fontWeight: '800', color: '#3D1A2A' },
  tipDesc: { fontSize: 13, color: '#6B7280', marginTop: 4, lineHeight: 18, fontWeight: '500' },
  quizBtn: { marginTop: 16, borderRadius: 20, overflow: 'hidden', elevation: 2 },
  quizGradient: { paddingVertical: 18, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  quizTxt: { color: '#7C3AED', fontSize: 18, fontWeight: '800' }
});
