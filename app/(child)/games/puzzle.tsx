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

const PUZZLES = [
  { id: 1, pieces: ['🐯', '🐘', '🦒', '🦓'], name: 'Jungle Friends' },
  { id: 2, pieces: ['🚀', '👨‍🚀', '🛸', '🪐'], name: 'Space Adventure' },
  { id: 3, pieces: ['🍕', '🍔', '🍟', '🍦'], name: 'Yummy Food' },
];

export default function PuzzleTime() {
  const router = useRouter();
  const [childId, setChildId] = useState<string | null>(null);
  const [currentPuzzle, setCurrentPuzzle] = useState(PUZZLES[0]);
  const [board, setBoard] = useState<(string | null)[]>([null, null, null, null]);
  const [shuffledPieces, setShuffledPieces] = useState<string[]>([]);
  const [winning, setWinning] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('childId').then(id => setChildId(id));
    loadPuzzle(PUZZLES[0]);
  }, []);

  const loadPuzzle = (puzzle: typeof PUZZLES[0]) => {
    setCurrentPuzzle(puzzle);
    setBoard([null, null, null, null]);
    setShuffledPieces([...puzzle.pieces].sort(() => Math.random() - 0.5));
    setWinning(false);
  };

  const handlePlacePiece = (piece: string, boardIndex: number) => {
    if (board[boardIndex]) return;

    const correctPiece = currentPuzzle.pieces[boardIndex];
    if (piece === correctPiece) {
      const newBoard = [...board];
      newBoard[boardIndex] = piece;
      setBoard(newBoard);

      const newShuffled = shuffledPieces.filter(p => p !== piece);
      setShuffledPieces(newShuffled);

      if (newBoard.every(p => p !== null)) {
        handleWin();
      }
    } else {
      Alert.alert('🌟 Keep Going!', 'You are doing great! Try a different piece, you can solve it! 💪');
    }
  };

  const handleWin = async () => {
    setWinning(true);
    if (childId) {
      await activityService.addActivity(`Completed Puzzle: ${currentPuzzle.name} 🧩`, childId);
      await rewardService.updateRewards(childId, 5);
    }
    Alert.alert('🎉 Puzzle Master!', 'You put it all together and earned 5 Stars! ⭐', [
      { text: 'Try Another', onPress: () => loadPuzzle(PUZZLES[Math.floor(Math.random() * PUZZLES.length)]) },
      { text: 'Exit', onPress: () => router.back() }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#B2E2F2', '#A1C4FD']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#164E63" />
          </TouchableOpacity>
          <Text style={styles.title}>Puzzle Time 🧩</Text>
          <View style={{ width: 44 }} />
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
        <Text style={styles.puzzleName}>{currentPuzzle.name}</Text>
        
        <View style={styles.board}>
          {board.map((piece, i) => (
            <View key={i} style={styles.boardSlot}>
              {piece ? (
                <Animated.Text entering={ZoomIn} style={styles.emoji}>{piece}</Animated.Text>
              ) : (
                <View style={styles.ghostContainer}>
                  <Text style={styles.ghostEmoji}>{currentPuzzle.pieces[i]}</Text>
                  <View style={styles.emptySlot} />
                </View>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.hint}>Taps the correct piece to place it!</Text>

        <View style={styles.toolbox}>
          <Text style={styles.toolboxTitle}>Your Pieces</Text>
          <View style={styles.piecesRow}>
            {shuffledPieces.map((piece, i) => (
              <TouchableOpacity
                key={i}
                style={styles.pieceBtn}
                onPress={() => {
                  // Find first empty slot and try to place
                  const emptyIdx = board.findIndex(b => b === null);
                  if (emptyIdx !== -1) handlePlacePiece(piece, emptyIdx);
                }}
              >
                <Text style={styles.pieceEmoji}>{piece}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
            style={styles.resetBtn} 
            onPress={() => loadPuzzle(currentPuzzle)}
        >
          <Ionicons name="refresh" size={18} color="#0891B2" style={{ marginRight: 8 }} />
          <Text style={styles.resetTxt}>Restart Puzzle</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F9FF' },
  header: { paddingTop: 60, paddingBottom: 24, paddingHorizontal: 20 },
  headerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '900', color: '#164E63' },
  scrollContent: { paddingBottom: 40, alignItems: 'center' },
  puzzleName: { fontSize: 26, fontWeight: '900', color: '#0E7490', marginTop: 24 },
  board: { width: 320, height: 320, backgroundColor: '#FFF', borderRadius: 40, padding: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', marginTop: 24, elevation: 12, shadowOpacity: 0.1, shadowRadius: 30, shadowOffset: { width: 0, height: 10 } },
  boardSlot: { width: 140, height: 140, margin: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: 24, borderStyle: 'dashed', borderWidth: 3, borderColor: '#BAE6FD' },
  ghostContainer: { justifyContent: 'center', alignItems: 'center' },
  ghostEmoji: { fontSize: 64, opacity: 0.15, position: 'absolute' },
  emptySlot: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E0F2FE', opacity: 0.5 },
  emoji: { fontSize: 72 },
  hint: { fontSize: 14, color: '#94A3B8', marginTop: 20, fontWeight: '700', letterSpacing: 0.5 },
  toolbox: { width: '100%', padding: 24, marginTop: 20 },
  toolboxTitle: { fontSize: 20, fontWeight: '900', color: '#0E7490', marginBottom: 20, textAlign: 'center' },
  piecesRow: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  pieceBtn: { width: 75, height: 75, backgroundColor: '#FFF', borderRadius: 22, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowOpacity: 0.08, borderBottomWidth: 5, borderBottomColor: '#A1C4FD' },
  pieceEmoji: { fontSize: 40 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 24, marginTop: 40, borderWidth: 1, borderColor: '#B2E2F2', elevation: 2 },
  resetTxt: { color: '#0891B2', fontWeight: '900', fontSize: 15 }
});
