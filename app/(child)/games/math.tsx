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

export default function MathQuiz() {
  const router = useRouter();
  const [childId, setChildId] = useState<string | null>(null);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState('+');
  const [options, setOptions] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [winning, setWinning] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('childId').then(id => setChildId(id));
    generateQuestion();
  }, []);

  const generateQuestion = () => {
    const chance = Math.random();
    let op = '+';
    let n1 = 0;
    let n2 = 0;

    if (chance < 0.33) {
      op = '+';
      n1 = Math.floor(Math.random() * 20) + 1;
      n2 = Math.floor(Math.random() * 20) + 1;
    } else if (chance < 0.66) {
      op = '-';
      n1 = Math.floor(Math.random() * 20) + 10;
      n2 = Math.floor(Math.random() * 10) + 1;
    } else {
      op = '*';
      n1 = Math.floor(Math.random() * 6) + 1;
      n2 = Math.floor(Math.random() * 6) + 1;
    }

    setNum1(n1);
    setNum2(n2);
    setOperator(op);

    const ans = op === '+' ? n1 + n2 : op === '-' ? n1 - n2 : n1 * n2;
    const newOptions = [ans];
    while (newOptions.length < 4) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const wrongAns = ans + (offset === 0 ? 2 : offset);
      if (wrongAns >= 0 && !newOptions.includes(wrongAns)) {
        newOptions.push(wrongAns);
      }
    }
    setOptions(newOptions.sort(() => Math.random() - 0.5));
  };

  const resetGame = () => {
    setScore(0);
    setWinning(false);
    generateQuestion();
  };

  const handleAnswer = async (selected: number) => {
    const ans = operator === '+' ? num1 + num2 : operator === '-' ? num1 - num2 : num1 * num2;
    if (selected === ans) {
      const newScore = score + 1;
      if (newScore >= 5) {
        setScore(5);
        setWinning(true);
        if (childId) {
          await activityService.addActivity('Completed Math Quiz 🤓', childId);
          await rewardService.updateRewards(childId, 5);
        }
        Alert.alert('🎉 Math Master!', 'You solved them all and earned 5 Stars! ⭐', [
          { text: 'Play Again', onPress: resetGame },
          { text: 'Exit', onPress: () => router.back() }
        ]);
      } else {
        setScore(newScore);
        generateQuestion();
      }
    } else {
      Alert.alert('🌟 Smart Choice!', 'You are getting better every time! Try once more, you can solve this puzzle! 🚀');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#B5EAD7', '#CFF4E8']} style={styles.header}>
        <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#2D4A47" />
            </TouchableOpacity>
            <Text style={styles.title}>Math Quiz ➕</Text>
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
          <Animated.View entering={ZoomIn.duration(600)} style={styles.board}>
            <Text style={styles.questionLabel}>What is...</Text>
            <Text style={styles.question}>{num1} {operator === '*' ? '×' : operator} {num2}</Text>
            <View style={styles.equalLine} />
            <Text style={styles.questionMark}>?</Text>
          </Animated.View>

          <View style={styles.optionsGrid}>
            {options.map((opt, i) => (
              <Animated.View key={i} entering={FadeInDown.delay(i * 100)} style={{width: '45%'}}>
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
              <Ionicons name="refresh" size={18} color="#059691" style={{ marginRight: 8 }} />
              <Text style={styles.resetTxt}>Restart Quiz</Text>
          </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FBFFFD' },
  header: { paddingTop: 60, paddingBottom: 24, paddingHorizontal: 20 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: '#2D4A47' },
  scoreBadge: { backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  scoreTxt: { color: '#2D4A47', fontWeight: '900', fontSize: 16 },
  scrollContent: { paddingBottom: 40 },
  board: { margin: 24, backgroundColor: '#FFF', borderRadius: 40, padding: 40, alignItems: 'center', elevation: 10, shadowColor: '#B5EAD7', shadowOpacity: 0.2, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, borderWidth: 1, borderColor: '#E8F5E9' },
  questionLabel: { fontSize: 16, color: '#8B9B9A', fontWeight: '800', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  question: { fontSize: 64, fontWeight: '900', color: '#34D399' },
  equalLine: { width: '50%', height: 6, backgroundColor: '#F1F5F9', marginVertical: 20, borderRadius: 3 },
  questionMark: { fontSize: 40, fontWeight: '900', color: '#CBD5E1' },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, justifyContent: 'space-around', gap: 16 },
  optionBtn: { width: '45%', backgroundColor: '#FFF', borderRadius: 28, paddingVertical: 28, alignItems: 'center', elevation: 5, shadowOpacity: 0.08, shadowRadius: 15, borderBottomWidth: 6, borderBottomColor: '#B5EAD7' },
  optionTxt: { fontSize: 36, fontWeight: '900', color: '#2D4A47' },
  resetBtn: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 24, marginTop: 32, borderWidth: 1, borderColor: '#B5EAD7', elevation: 2 },
  resetTxt: { color: '#34D399', fontWeight: '900', fontSize: 15 }
});
