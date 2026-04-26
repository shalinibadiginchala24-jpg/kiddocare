import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, StatusBar, Modal, TextInput, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInUp, 
  BounceIn, 
  ZoomIn, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { taskService } from '@/services/taskService';
import { childService } from '@/services/childService';
import { rewardService } from '@/services/rewardService';
import { alertService } from '@/services/alertService';

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

export default function ChildHome() {
  const router = useRouter();
  const [childId, setChildId] = useState<string | null>(null);
  const [childName, setChildName] = useState('Kiddo');
  const [tasks, setTasks] = useState<any[]>([]);
  const [stars, setStars] = useState(0);
  const [loading, setLoading] = useState(true);

  // Modals
  const [moodModalVisible, setMoodModalVisible] = useState(false);
  const [rewardsModalVisible, setRewardsModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [motivation, setMotivation] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🧒');
  const [editName, setEditName] = useState('');

  const moods = [
    { emoji: '😊', label: 'Happy', color: '#FFF9C4', motivation: "Awesome! Keep that bright smile shining all day! 🌟" },
    { emoji: '😌', label: 'Calm', color: '#C8E6C9', motivation: "Peaceful vibes! You're ready to learn and play! 🧘" },
    { emoji: '😢', label: 'Sad', color: '#BBDEFB', motivation: "It's okay to feel sad. You are so brave, and better times are coming! 🩹" },
    { emoji: '😡', label: 'Angry', color: '#FFCDD2', motivation: "Take 3 deep breaths. You are bigger than your frustration. 🌬️" },
    { emoji: '😴', label: 'Sleepy', color: '#E1BEE7', motivation: "Get cozy! A superhero needs their sleep fuel. 🛌" },
    { emoji: '🤩', label: 'Excited', color: '#FFE0B2', motivation: "Woohoo! Let's channel that big energy into fun! 🎉" },
    { emoji: '🤢', label: 'Sick', color: '#DCEDC8', motivation: "Oh no! Rest well, drink soup, and get better soon. 🧸" },
    { emoji: '🤫', label: 'Shy', color: '#F8BBD0', motivation: "Take your time. You are special just being you! 💜" },
  ];

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setup = async () => {
      try {
        const id = await AsyncStorage.getItem('childId');
        if (!id) { router.replace('/child-login'); return; }
        setChildId(id);

        const cachedName = await AsyncStorage.getItem('childName');
        if (cachedName) {
          setChildName(cachedName);
          setEditName(cachedName);
        }

        const cachedAvatar = await AsyncStorage.getItem('childAvatar');
        if (cachedAvatar) setSelectedAvatar(cachedAvatar);

        try {
          const profile = await childService.getChild(id);
          const fetchedName = (profile as any).name || 'Kiddo';
          setChildName(fetchedName);
          setEditName(fetchedName);
          await AsyncStorage.setItem('childName', fetchedName);
        } catch (_) {}

        try {
          const s = await rewardService.getRewards(id);
          setStars(s);
        } catch (_) {}

        unsubscribe = taskService.subscribeToChildTasks(id, (ts: any[]) => {
          setTasks(ts);
          setLoading(false);
        });
      } catch (e) {
        console.error('Child home setup error', e);
        setLoading(false);
      }
    };

    setup();
    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const handleSelectMood = async (moodItem: any) => {
    setSelectedMood(moodItem.label);
    setMotivation(moodItem.motivation);
    
    try {
      if (childId) {
        await alertService.addAlert(childId, `💬 MOOD UPDATE: ${childName} is feeling ${moodItem.label} ${moodItem.emoji} right now.`, 'info');
      }
    } catch (e) {
      console.log('Error sending mood alert', e);
    }
  };

  // Old chat handle message function removed, handled by chat screen now

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length > 0 ? completedCount / tasks.length : 0;

  if (loading) {
    return (
      <LinearGradient colors={['#FFE4E6', '#EDE9FE']} style={styles.loader}>
        <ActivityIndicator size="large" color="#FF6B9D" />
      </LinearGradient>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFF5F7' }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* Header */}
        <LinearGradient colors={['#FFD1DC', '#EDE9FE']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <View style={styles.profileRow}>
            <View style={styles.profileLeft}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarEmoji}>{selectedAvatar}</Text>
              </View>
              <View style={styles.profileInfoText}>
                <Text style={styles.greeting}>Hello 👋</Text>
                <Text style={styles.childName}>{childName}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => router.push('/(child)/settings' as any)} style={styles.settingsBtn}>
              <Ionicons name="settings-outline" size={24} color="#7C3AED" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Special Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Features ✨</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.premiumScroll}>
            {[
              { label: 'AI Buddy', route: '/(child)/ai-buddy', bg: '#EDE9FE', emoji: '🤖', color: '#6D28D9' },
              { label: 'Journey Map', route: '/(child)/map', bg: '#FFE4E6', emoji: '🗺️', color: '#BE123C' },
              { label: 'Safe Zone', route: '/(child)/safety', bg: '#DCFCE7', emoji: '🛡️', color: '#065F46' },
            ].map((item, i) => (
              <Animated.View key={item.label} entering={FadeInUp.delay(i * 100).duration(600).springify()} style={styles.premiumCardWrap}>
                <PressableScale onPress={() => router.push(item.route as any)}>
                  <View style={[styles.premiumCard, { backgroundColor: item.bg }]}>
                    <Text style={styles.premiumEmoji}>{item.emoji}</Text>
                    <Text style={[styles.premiumLabel, { color: item.color }]}>{item.label}</Text>
                  </View>
                </PressableScale>
              </Animated.View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Dashboard 🎮</Text>
          <View style={styles.funGrid}>
            {[
              { label: 'Tasks', icon: 'checklist', route: '/(child)/(tabs)/tasks', color: ['#EDE9FE', '#DDD6FE'] },
              { label: 'Stories', icon: 'menu-book', route: '/(child)/(tabs)/stories', color: ['#DCFCE7', '#BBF7D0'] },
              { label: 'Games', icon: 'games', route: '/(child)/(tabs)/games', color: ['#FFE4E6', '#FECDD3'] },
              { label: 'SOS', icon: 'campaign', route: '/(child)/(tabs)/sos', color: ['#FEF9C3', '#FDE68A'] },
              { label: 'Account', icon: 'account-circle', modal: 'account', color: ['#BAE6FD', '#7DD3FC'] },
              { label: 'Moods', icon: 'face', modal: 'mood', color: ['#FEF9C3', '#FDE68A'] },
              { label: 'Rewards', icon: 'stars', modal: 'rewards', color: ['#DCFCE7', '#BBF7D0'] },
              { label: 'Message Parent', icon: 'chat', route: '/(child)/chat', color: ['#FFD1DC', '#FECDD3'] },
            ].map((item, i) => (
              <Animated.View key={item.label} entering={ZoomIn.delay(i * 80).duration(600).springify()} style={styles.funCardWrap}>
                <PressableScale onPress={() => {
                  if (item.route) { router.push(item.route as any); }
                  else if (item.modal === 'mood') { setMoodModalVisible(true); }
                  else if (item.modal === 'rewards') { setRewardsModalVisible(true); }
                  else if (item.modal === 'account') { setEditName(childName); setAccountModalVisible(true); }
                }}>
                  <LinearGradient colors={item.color as any} style={styles.funCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    <View style={styles.funIconCircle}>
                      <MaterialIcons name={item.icon as any} size={28} color="#4A4A4A" />
                    </View>
                    <Text style={styles.funLabel}>{item.label}</Text>
                  </LinearGradient>
                </PressableScale>
              </Animated.View>
            ))}
          </View>
        </View>

      </ScrollView>

      {/* Account / Edit Profile Modal */}
      <Modal transparent visible={accountModalVisible} animationType="fade" onRequestClose={() => setAccountModalVisible(false)}>
        <View style={styles.overlay}>
          <Animated.View entering={ZoomIn.duration(300)} style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile ✏️</Text>
              <TouchableOpacity onPress={() => setAccountModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#4A4A4A" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>My Name:</Text>
              <TextInput
                style={styles.nameInput}
                value={editName}
                onChangeText={setEditName}
                placeholder="Type your name here..."
                placeholderTextColor="#9CA3AF"
              />

              <Text style={styles.inputLabel}>Choose an Avatar:</Text>
              <View style={styles.avatarGrid}>
                {['🧒', '👦', '👧', '🦊', '🦁', '🦄', '🐼', '🚀'].map((av) => (
                  <TouchableOpacity 
                     key={av} 
                     style={[styles.avatarChoice, selectedAvatar === av && styles.selectedAvatarChoice]}
                     onPress={() => setSelectedAvatar(av)}
                  >
                    <Text style={{ fontSize: 32 }}>{av}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.saveProfileBtn} onPress={async () => {
                if (!editName.trim()) { Alert.alert('Oops!', 'Please enter a name.'); return; }
                setChildName(editName.trim());
                await AsyncStorage.setItem('childName', editName.trim());
                await AsyncStorage.setItem('childAvatar', selectedAvatar);
                setAccountModalVisible(false);
                Alert.alert('Saved!', 'Your profile has been updated! 🎉');
              }}>
                <Text style={styles.saveProfileTxt}>Save Profile</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Mood Tracker Modal */}
      <Modal transparent visible={moodModalVisible} animationType="fade" onRequestClose={() => setMoodModalVisible(false)}>
        <View style={styles.overlay}>
          <Animated.View entering={ZoomIn.duration(300)} style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>How are you feeling?</Text>
              <TouchableOpacity onPress={() => { setMoodModalVisible(false); setSelectedMood(null); setMotivation(''); }} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#4A4A4A" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              {!selectedMood ? (
                <View style={styles.moodGrid}>
                  {moods.map((m) => (
                    <TouchableOpacity key={m.label} style={[styles.moodItem, { backgroundColor: m.color }]} onPress={() => handleSelectMood(m)}>
                      <Text style={styles.moodEmoji}>{m.emoji}</Text>
                      <Text style={styles.moodLabel}>{m.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.motivationBox}>
                  <Text style={styles.motivationEmoji}>✨</Text>
                  <Text style={styles.motivationText}>{motivation}</Text>
                  <Text style={styles.sentText}>✓ Sent update to parents</Text>
                  <TouchableOpacity style={styles.backToMoodBtn} onPress={() => { setSelectedMood(null); setMotivation(''); }}>
                    <Text style={styles.backToMoodTxt}>Change Mood</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Rewards Modal */}
      <Modal transparent visible={rewardsModalVisible} animationType="fade" onRequestClose={() => setRewardsModalVisible(false)}>
        <View style={styles.overlay}>
          <Animated.View entering={ZoomIn.duration(300)} style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Stars Breakdown ⭐</Text>
              <TouchableOpacity onPress={() => setRewardsModalVisible(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#4A4A4A" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.totalStarsCount}>{stars} Stars</Text>
              <Text style={styles.historyHeading}>Earning History:</Text>
              
              <View style={styles.historyRow}>
                <Text style={styles.historyTask}>📋 Missions Checklist</Text>
                <Text style={styles.historyScore}>+20 ⭐</Text>
              </View>
              <View style={styles.historyRow}>
                <Text style={styles.historyTask}>🧠 Memory Match Game</Text>
                <Text style={styles.historyScore}>+10 ⭐</Text>
              </View>
              <View style={styles.historyRow}>
                <Text style={styles.historyTask}>📚 Reading Journey</Text>
                <Text style={styles.historyScore}>+15 ⭐</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Chat modal removed entirely */}

    </View>
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 32, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 },
  profileRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profileLeft: { flexDirection: 'row', alignItems: 'center' },
  avatarCircle: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#FF6B9D', shadowOpacity: 0.2, shadowRadius: 8 },
  avatarEmoji: { fontSize: 34 },
  profileInfoText: { marginLeft: 16 },
  greeting: { fontSize: 14, color: '#C44DFF', fontWeight: '700' },
  childName: { fontSize: 24, fontWeight: '900', color: '#3D1A2A', marginTop: 2 },
  settingsBtn: { backgroundColor: 'rgba(255,255,255,0.55)', padding: 12, borderRadius: 20 },
  section: { marginHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: '#3D1A2A', marginBottom: 16 },
  funGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  funCardWrap: { width: '47%', marginBottom: 4 },
  funCard: { borderRadius: 24, paddingVertical: 22, paddingHorizontal: 12, alignItems: 'center', justifyContent: 'center', elevation: 1, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)' },
  funIconCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.5)', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  funLabel: { fontSize: 14, fontWeight: '900', color: '#3D1A2A', textAlign: 'center' },
  premiumScroll: { paddingBottom: 8 },
  premiumCardWrap: { marginRight: 12, width: 120 },
  premiumCard: { padding: 18, borderRadius: 24, alignItems: 'center', justifyContent: 'center', minHeight: 110, borderWidth: 1, borderColor: 'rgba(0,0,0,0.03)', elevation: 1 },
  premiumEmoji: { fontSize: 32, marginBottom: 8 },
  premiumLabel: { fontSize: 13, fontWeight: '900', textAlign: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { backgroundColor: '#FFF', borderRadius: 32, width: '100%', maxWidth: 400, overflow: 'hidden', elevation: 10, shadowOpacity: 0.1, shadowRadius: 20 },
  modalHeader: { padding: 20, borderBottomWidth: 1, borderBottomColor: '#FEE2E2', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF5F7' },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#3D1A2A' },
  modalBody: { padding: 24 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFE4E6', justifyContent: 'center', alignItems: 'center' },
  inputLabel: { fontSize: 14, fontWeight: '800', color: '#3D1A2A', marginTop: 12, marginBottom: 8 },
  nameInput: { backgroundColor: '#FFF5F7', borderWidth: 1.5, borderColor: '#FECDD3', borderRadius: 14, padding: 12, fontSize: 16, color: '#3D1A2A' },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginVertical: 12, justifyContent: 'center' },
  avatarChoice: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#FFF5F7', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  selectedAvatarChoice: { borderColor: '#FF6B9D', backgroundColor: '#FFE4E6' },
  saveProfileBtn: { backgroundColor: '#FF6B9D', paddingVertical: 14, borderRadius: 20, alignItems: 'center', marginTop: 20, elevation: 2 },
  saveProfileTxt: { color: '#FFF', fontSize: 16, fontWeight: '800' },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  moodItem: { width: '47%', borderRadius: 20, padding: 16, alignItems: 'center', justifyContent: 'center' },
  moodEmoji: { fontSize: 36 },
  moodLabel: { fontSize: 14, fontWeight: '800', color: '#3D1A2A', marginTop: 8 },
  motivationBox: { alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  motivationEmoji: { fontSize: 48, marginBottom: 10 },
  motivationText: { fontSize: 16, fontWeight: '700', color: '#3D1A2A', textAlign: 'center', lineHeight: 22, paddingHorizontal: 10 },
  sentText: { fontSize: 12, color: '#FF6B9D', fontWeight: '800', marginTop: 15 },
  backToMoodBtn: { marginTop: 24, paddingVertical: 10, paddingHorizontal: 20, backgroundColor: '#FFE4E6', borderRadius: 12 },
  backToMoodTxt: { fontSize: 14, color: '#BE185D', fontWeight: '700' },
  totalStarsCount: { fontSize: 36, fontWeight: '900', color: '#FF6B9D', textAlign: 'center', marginVertical: 10 },
  historyHeading: { fontSize: 16, fontWeight: '800', color: '#3D1A2A', marginTop: 20, marginBottom: 10 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#FEE2E2' },
  historyTask: { fontSize: 14, fontWeight: '600', color: '#3D1A2A' },
  historyScore: { fontSize: 14, fontWeight: '800', color: '#FF6B9D' }
});
