import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { ZoomIn, FadeInRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { activityService } from '@/services/activityService';
import { rewardService } from '@/services/rewardService';
import LottieView from 'lottie-react-native';

const EMOJIS = ['🍦', '⭐', '🎈', '🐶', '🐱', '🍎', '🚗', '🚀', '🌈', '🍭'];

export default function CountingGame() {
  const router = useRouter();
  const [childId, setChildId] = useState<string | null>(null);
  const [count, setCount] = useState(0);
  const [targetEmoji, setTargetEmoji] = useState('⭐');
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [winning, setWinning] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('childId').then(id => setChildId(id));
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const newCount = Math.floor(Math.random() * 9) + 1;
    const newEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    setCount(newCount);
    setTargetEmoji(newEmoji);

    const newOptions = [newCount];
    while (newOptions.length < 4) {
      const wrong = Math.floor(Math.random() * 9) + 1;
      if (!newOptions.includes(wrong)) {
        newOptions.push(wrong);
      }
    }
    setOptions(newOptions.sort(() => Math.random() - 0.5));
  };

  const handleAnswer = async (selected: number) => {
    if (selected === count) {
      const newScore = score + 1;
      if (newScore >= 5) {
        setScore(5);
        setWinning(true);
        if (childId) {
          await activityService.addActivity('Completed Counting Game 🔢', childId);
          await rewardService.updateRewards(childId, 5);
        }
        Alert.alert('🎉 Counting Master!', 'You counted them all and earned 5 Stars! ⭐', [
          { text: 'Play Again', onPress: resetGame },
          { text: 'Exit', onPress: () => router.back() }
        ]);
      } else {
        setScore(newScore);
        generateQuestion();
      }
    } else {
      Alert.alert('🎈 Great Effort!', 'You are very close! Try counting one more time, you\'re doing amazing! ✨');
    }
  };

  const resetGame = () => {
    setScore(0);
    setWinning(false);
    generateQuestion();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#FFF9C4', '#FFF176']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#5C4033" />
          </TouchableOpacity>
          <Text style={styles.title}>Counting Game 🔢</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreTxt}>{score}/5</Text>
          </View>
        </View>
      </LinearGradient>

      {winning && (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <LottieView
            source={require('../../../assets/animation.json')}
            autoPlay
            loop
            style={{ flex: 1 }}
          />
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.questionArea}>
          <Text style={styles.questionLabel}>How many {targetEmoji} are there?</Text>
          <View style={styles.objectsGrid}>
            {Array.from({ length: count }).map((_, i) => (
              <Animated.Text 
                key={i} 
                entering={ZoomIn.delay(i * 100)} 
                style={styles.emoji}
              >
                {targetEmoji}
              </Animated.Text>
            ))}
          </View>
        </View>

        <View style={styles.optionsGrid}>
          {options.map((opt, i) => (
            <Animated.View key={opt} entering={FadeInRight.delay(i * 100)}>
              <TouchableOpacity 
                style={styles.optionBtn}
                onPress={() => handleAnswer(opt)}
                activeOpacity={0.8}
              >
                <Text style={styles.optionTxt}>{opt}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <TouchableOpacity style={styles.resetBtn} onPress={resetGame}>
          <Ionicons name="refresh" size={18} color="#EC4899" style={{ marginRight: 8 }} />
          <Text style={styles.resetTxt}>Restart Game</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDFD' },
  header: { paddingTop: 60, paddingBottom: 24, paddingHorizontal: 20 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: '#5C4033' },
  scoreBadge: { backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  scoreTxt: { color: '#5C4033', fontWeight: '900', fontSize: 16 },
  scrollContent: { paddingBottom: 40 },
  questionArea: { margin: 24, padding: 32, backgroundColor: '#FFF', borderRadius: 40, alignItems: 'center', elevation: 12, shadowOpacity: 0.1, shadowRadius: 25, shadowOffset: { width: 0, height: 10 }, borderWidth: 1, borderColor: '#FFF9C4' },
  questionLabel: { fontSize: 20, color: '#8B7355', fontWeight: '900', marginBottom: 24, textAlign: 'center' },
  objectsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, minHeight: 140 },
  emoji: { fontSize: 48 },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, paddingHorizontal: 20 },
  optionBtn: { width: 150, height: 90, backgroundColor: '#FFF', borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowOpacity: 0.08, borderBottomWidth: 6, borderBottomColor: '#FFF176' },
  optionTxt: { fontSize: 36, fontWeight: '900', color: '#5C4033' },
  resetBtn: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 24, marginTop: 40, borderWidth: 1, borderColor: '#FFF176', elevation: 2 },
  resetTxt: { color: '#8B7355', fontWeight: '900', fontSize: 15 }
});
