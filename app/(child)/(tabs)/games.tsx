import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { activityService } from '@/services/activityService';

const GAMES = [
  { id: '1', title: 'Memory Match', emoji: '🧠', color: ['#C7CEEA', '#E2D1F9'] as const, desc: 'Test your memory!' },
  { id: '2', title: 'Math Quiz', emoji: '➕', color: ['#B5EAD7', '#98FB98'] as const, desc: 'Solve fun problems!' },
  { id: '3', title: 'Coloring Book', emoji: '🎨', color: ['#FFDAC1', '#FFB347'] as const, desc: 'Paint and create!' },
  { id: '4', title: 'Word Spelling', emoji: '📝', color: ['#FFD1DC', '#FFB7C5'] as const, desc: 'Learn new words!' },
  { id: '5', title: 'Puzzle Time', emoji: '🧩', color: ['#B2E2F2', '#A1C4FD'] as const, desc: 'Build pictures!' },
  { id: '6', title: 'Counting Game', emoji: '🔢', color: ['#FFF9C4', '#FFF176'] as const, desc: 'Count and learn!' },
];

export default function ChildGames() {
  const router = useRouter();
  const [childId, setChildId] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('childId').then(id => {
      setChildId(id);
    });
  }, []);

  const handlePlay = async (game: typeof GAMES[0]) => {
    try {
      if (game.title === 'Memory Match') {
        router.push('/(child)/games/memory');
      } else if (game.title === 'Math Quiz') {
        router.push('/(child)/games/math');
      } else if (game.title === 'Word Spelling') {
        router.push('/(child)/games/spelling');
      } else if (game.title === 'Coloring Book') {
        router.push('/(child)/games/coloring');
      } else if (game.title === 'Puzzle Time') {
        router.push('/(child)/games/puzzle');
      } else if (game.title === 'Counting Game') {
        router.push('/(child)/games/counting');
      } else {
        if (childId) {
          await activityService.addActivity(`Played ${game.title}`, childId);
        }
        Alert.alert(
          `${game.emoji} ${game.title}`, 
          'This game is coming very soon! Keep completing missions!'
        );
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Oops', 'Something went wrong while trying to play.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient 
        colors={['#FFF5E6', '#FFEFD5']} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }} 
        style={styles.header}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Games 🎮</Text>
          <Text style={styles.sub}>Play, learn and earn stars!</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.grid}>
        {GAMES.map((game, i) => (
          <Animated.View key={game.id} entering={ZoomIn.delay(i * 80)} style={styles.cardWrap}>
            <TouchableOpacity onPress={() => handlePlay(game)} activeOpacity={0.85}>
              <LinearGradient colors={game.color} style={styles.card}>
                <View style={styles.emojiCircle}>
                  <Text style={styles.emoji}>{game.emoji}</Text>
                </View>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <Text style={styles.gameDesc}>{game.desc}</Text>
                <View style={styles.playBtn}>
                  <Text style={styles.playTxt}>Play ▶</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 32, flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '900', color: '#5C4033' },
  sub: { fontSize: 16, color: '#8B7355', marginTop: 4, fontWeight: '600' },
  grid: { padding: 16, flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', paddingBottom: 100 },
  cardWrap: { width: '47%', marginBottom: 8 },
  card: { borderRadius: 32, padding: 20, alignItems: 'center', elevation: 0, shadowOpacity: 0.05, shadowRadius: 15, shadowOffset: { width: 0, height: 10 } },
  emojiCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  emoji: { fontSize: 36 },
  gameTitle: { fontSize: 16, fontWeight: '900', color: '#4A4A4A', textAlign: 'center' },
  gameDesc: { fontSize: 12, color: 'rgba(0,0,0,0.5)', textAlign: 'center', marginTop: 4, fontWeight: '500' },
  playBtn: { marginTop: 14, backgroundColor: '#FFF', borderRadius: 16, paddingHorizontal: 20, paddingVertical: 8, elevation: 2 },
  playTxt: { fontSize: 13, fontWeight: '900', color: '#4A4A4A' },
});
