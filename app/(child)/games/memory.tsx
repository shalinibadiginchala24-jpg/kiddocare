import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { activityService } from '@/services/activityService';
import { rewardService } from '@/services/rewardService';
import LottieView from 'lottie-react-native';

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊'];

type Card = { id: number; emoji: string; isFlipped: boolean; isMatched: boolean };

export default function MemoryMatch() {
  const router = useRouter();
  const [childId, setChildId] = useState<string | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [winning, setWinning] = useState(false);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem('childId').then(id => setChildId(id));
    initializeGame();
  }, []);

  const initializeGame = () => {
    const deck = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({ id: idx, emoji, isFlipped: false, isMatched: false }));
    setCards(deck);
    setMatches(0);
    setMoves(0);
    setFlippedIndices([]);
    setWinning(false);
  };

  const handleCardPress = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const match = newCards[newFlipped[0]].emoji === newCards[newFlipped[1]].emoji;
      
      setTimeout(async () => {
        const resetCards = [...newCards];
        if (match) {
          resetCards[newFlipped[0]].isMatched = true;
          resetCards[newFlipped[1]].isMatched = true;
          const newMatches = matches + 1;
          setMatches(newMatches);

          if (newMatches === EMOJIS.length) {
            setWinning(true);
            if (childId) {
              await activityService.addActivity('Completed Memory Match 🧠', childId);
              await rewardService.updateRewards(childId, 5);
            }
            Alert.alert('🎉 Superstar!', `You matched them all in ${moves + 1} moves and earned 5 Stars! ⭐`, [
              { text: 'Play Again', onPress: initializeGame },
              { text: 'Exit', onPress: () => router.back() }
            ]);
          }
        } else {
          resetCards[newFlipped[0]].isFlipped = false;
          resetCards[newFlipped[1]].isFlipped = false;
        }
        setCards(resetCards);
        setFlippedIndices([]);
      }, 800);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#C7CEEA', '#E2D1F9']} style={styles.header}>
        <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#483D8B" />
            </TouchableOpacity>
            <Text style={styles.title}>Memory Match 🧠</Text>
            <View style={styles.movesBadge}>
                <Text style={styles.movesTxt}>{moves} Moves</Text>
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
          <View style={styles.grid}>
            {cards.map((card, i) => (
              <Animated.View 
                key={card.id} 
                entering={ZoomIn.delay(i * 40)} 
                style={styles.cardContainer}
              >
                <TouchableOpacity 
                  style={[
                    styles.card, 
                    (card.isFlipped || card.isMatched) ? styles.cardFlipped : styles.cardBackStyle,
                    card.isMatched && styles.cardMatched
                  ]} 
                  onPress={() => handleCardPress(i)}
                  activeOpacity={0.7}
                >
                  {(card.isFlipped || card.isMatched) ? (
                    <Animated.Text entering={ZoomIn} style={styles.emoji}>{card.emoji}</Animated.Text>
                  ) : (
                    <Ionicons name="help-circle" size={40} color="rgba(255,255,255,0.4)" />
                  )}
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
          
          <TouchableOpacity style={styles.resetBtn} onPress={initializeGame}>
              <Ionicons name="refresh" size={20} color="#7C3AED" style={{ marginRight: 8 }} />
              <Text style={styles.resetTxt}>Restart Game</Text>
          </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9FF' },
  header: { paddingTop: 60, paddingBottom: 24, paddingHorizontal: 20 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: '#483D8B' },
  movesBadge: { backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  movesTxt: { color: '#483D8B', fontWeight: '800', fontSize: 13 },
  scrollContent: { paddingBottom: 40 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 20, justifyContent: 'space-between' },
  cardContainer: { width: '31%', aspectRatio: 0.85, marginBottom: 12 },
  card: { flex: 1, borderRadius: 24, justifyContent: 'center', alignItems: 'center', elevation: 2, shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  cardBackStyle: { backgroundColor: '#C7CEEA' },
  cardFlipped: { backgroundColor: '#FFF' },
  cardMatched: { backgroundColor: '#F0F0FF', opacity: 0.7, borderWidth: 2, borderColor: '#C7CEEA', elevation: 0 },
  emoji: { fontSize: 36 },
  resetBtn: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24, marginTop: 15, borderWidth: 1, borderColor: '#C7CEEA', elevation: 2 },
  resetTxt: { color: '#7C3AED', fontWeight: '900', fontSize: 16 }
});
