import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { activityService } from '@/services/activityService';
import { rewardService } from '@/services/rewardService';
import LottieView from 'lottie-react-native';

const WORDS = [
  { word: 'APPLE', emoji: '🍎' },
  { word: 'CAT', emoji: '🐱' },
  { word: 'DOG', emoji: '🐶' },
  { word: 'SUN', emoji: '☀️' },
  { word: 'TREE', emoji: '🌳' },
  { word: 'FISH', emoji: '🐟' },
  { word: 'BALL', emoji: '⚽' },
  { word: 'BIRD', emoji: '🐦' },
  { word: 'MILK', emoji: '🥛' },
  { word: 'CAKE', emoji: '🍰' },
];

export default function SpellingGame() {
  const router = useRouter();
  const [childId, setChildId] = useState<string | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userSpelling, setUserSpelling] = useState('');
  const [letters, setLetters] = useState<string[]>([]);
  const [winning, setWinning] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('childId').then(id => setChildId(id));
    loadWord(0);
  }, []);

  const loadWord = (index: number) => {
    const word = WORDS[index].word;
    const scrambled = word.split('').sort(() => Math.random() - 0.5);
    // Add some random letters to make it harder
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 3; i++) {
        scrambled.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
    setLetters(scrambled.sort(() => Math.random() - 0.5));
    setUserSpelling('');
    setFeedback(null);
  };

  const resetGame = () => {
    setCurrentWordIndex(0);
    setWinning(false);
    loadWord(0);
  };

  const handleLetterPress = (char: string) => {
    if (feedback === 'correct') return;
    const newSpelling = userSpelling + char;
    setUserSpelling(newSpelling);
    setFeedback(null);
  };

  const handleCheck = async () => {
    const isCorrect = userSpelling === WORDS[currentWordIndex].word;
    
    if (isCorrect) {
      setFeedback('correct');
      if (currentWordIndex + 1 >= WORDS.length) {
        setTimeout(async () => {
          setWinning(true);
          if (childId) {
            await activityService.addActivity('Completed Spelling Bee 🐝', childId);
            await rewardService.updateRewards(childId, 5);
          }
          Alert.alert('🎉 Spelling Champion!', 'You spelled everything correctly and earned 5 Stars! ⭐', [
            { text: 'Play Again', onPress: resetGame },
            { text: 'Exit', onPress: () => router.back() }
          ]);
        }, 800);
      } else {
        setTimeout(() => {
          const nextIdx = currentWordIndex + 1;
          setCurrentWordIndex(nextIdx);
          loadWord(nextIdx);
        }, 1200);
      }
    } else {
      setFeedback('wrong');
      Alert.alert(
        '🌈 Don\'t Give Up!', 
        'You are almost there! Every mistake helps you learn. Check the figure and try again! 🌟', 
        [{ text: 'Try Again', onPress: () => {
          setUserSpelling('');
          setFeedback(null);
        }}]
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#FFD1DC', '#FFB7C5']} style={styles.header}>
        <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#5C4033" />
            </TouchableOpacity>
            <Text style={styles.title}>Spelling Bee 🐝</Text>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreTxt}>{currentWordIndex}/{WORDS.length}</Text>
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
          <Animated.View entering={ZoomIn.duration(600)} style={[
              styles.board,
              feedback === 'correct' && styles.boardCorrect,
              feedback === 'wrong' && styles.boardWrong
          ]}>
            <View style={styles.feedbackSignal}>
                {feedback === 'correct' && <Ionicons name="checkmark-circle" size={40} color="#10B981" />}
                {feedback === 'wrong' && <Ionicons name="close-circle" size={40} color="#EF4444" />}
            </View>
            <Text style={styles.emoji}>{WORDS[currentWordIndex].emoji}</Text>
            <View style={styles.spellingContainer}>
                <Text style={styles.spellingBox}>{userSpelling || '??'}</Text>
            </View>
            <Text style={styles.helpTxt}>Spell the name of the figure!</Text>
          </Animated.View>

          <View style={styles.lettersGrid}>
            {letters.map((char, i) => (
              <Animated.View key={i} entering={FadeInDown.delay(i * 50)}>
                <TouchableOpacity 
                    style={styles.letterBtn} 
                    onPress={() => handleLetterPress(char)}
                    activeOpacity={0.7}
                >
                  <Text style={styles.letterTxt}>{char}</Text>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
          
          <View style={styles.actionRow}>
              <TouchableOpacity style={styles.clearBtn} onPress={() => setUserSpelling('')}>
                <Ionicons name="backspace-outline" size={20} color="#DC2626" style={{ marginRight: 8 }} />
                <Text style={styles.clearTxt}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.enterBtn, (!userSpelling || feedback === 'correct') && { opacity: 0.5 }]} onPress={handleCheck} disabled={!userSpelling || feedback === 'correct'}>
                <Text style={styles.enterTxt}>Enter ✓</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resetBtn} onPress={resetGame}>
                <Ionicons name="refresh" size={20} color="#FFF" />
              </TouchableOpacity>
          </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDFD' },
  header: { paddingTop: 60, paddingBottom: 24, paddingHorizontal: 20 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: '#5C4033' },
  scoreBadge: { backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  scoreTxt: { color: '#5C4033', fontWeight: '900', fontSize: 16 },
  scrollContent: { paddingBottom: 40 },
  board: { margin: 24, backgroundColor: '#FFF', borderRadius: 40, padding: 30, alignItems: 'center', elevation: 12, shadowColor: '#FFD1DC', shadowOpacity: 0.2, shadowRadius: 25, shadowOffset: { width: 0, height: 10 }, borderWidth: 2, borderColor: '#FFD1DC' },
  boardCorrect: { borderColor: '#10B981', shadowColor: '#10B981' },
  boardWrong: { borderColor: '#EF4444', shadowColor: '#EF4444' },
  feedbackSignal: { position: 'absolute', top: 20, right: 20, height: 40, width: 40 },
  emoji: { fontSize: 100, marginBottom: 20 },
  spellingContainer: { backgroundColor: '#FFF9FB', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 20, borderStyle: 'dashed', borderWidth: 3, borderColor: '#FFB7C5', justifyContent: 'center', alignItems: 'center', minWidth: 150 },
  spellingBox: { fontSize: 36, fontWeight: '900', color: '#5C4033', letterSpacing: 6 },
  helpTxt: { fontSize: 14, color: '#8B7355', marginTop: 16, fontWeight: '800', opacity: 0.8 },
  lettersGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, justifyContent: 'center', gap: 14, marginBottom: 10 },
  letterBtn: { backgroundColor: '#FFF', borderRadius: 20, width: 68, height: 68, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowOpacity: 0.08, borderBottomWidth: 6, borderBottomColor: '#FFB7C5' },
  letterTxt: { fontSize: 32, fontWeight: '900', color: '#B91C1C' },
  actionRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, gap: 12 },
  clearBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 20, paddingVertical: 14, borderRadius: 24, borderWidth: 1, borderColor: '#FFB7C5', elevation: 2 },
  clearTxt: { color: '#B91C1C', fontWeight: '900', fontSize: 16 },
  enterBtn: { backgroundColor: '#B91C1C', paddingHorizontal: 30, paddingVertical: 14, borderRadius: 24, elevation: 4 },
  enterTxt: { color: '#FFF', fontWeight: '900', fontSize: 18 },
  resetBtn: { backgroundColor: '#FFB7C5', width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  resetTxt: { color: '#FFF', fontWeight: 'bold', fontSize: 18 }
});
