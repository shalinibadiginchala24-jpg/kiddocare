import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Alert, Animated as RNAnimated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { SlideInRight, SlideInLeft, SlideOutRight, SlideOutLeft, FadeIn, ZoomIn } from 'react-native-reanimated';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { activityService } from '@/services/activityService';
import { rewardService } from '@/services/rewardService';
import LottieView from 'lottie-react-native';
import { Ionicons } from '@expo/vector-icons';

const STORIES_DATA: Record<string, { title: string, emoji: string, color: string[], pages: string[], sceneEmoji: string[] }> = {
  '1': {
    title: 'The Lion & The Mouse',
    emoji: '🦁',
    color: ['#F59E0B', '#D97706'],
    pages: [
      "Once upon a time, a mighty Lion was sleeping under a big tree in the jungle.",
      "A little Mouse ran over his paw and woke him up! The Lion was very grumpy.",
      "The Lion caught the Mouse. 'Please let me go!' cried the Mouse. 'Someday I can help you!'",
      "The Lion laughed. 'You are too small to help me!' But he let the Mouse go anyway.",
      "Later, the Lion got trapped in a hunter's net! He roared loudly for help.",
      "The little Mouse heard the roar. He ran over and chewed through the ropes to free the Lion.",
      "The Lion was free! 'Thank you, little friend,' he said. 'You may be small, but you are very helpful.'",
    ],
    sceneEmoji: ['🌳', '🐭', '🤝', '😂', '🕸️', '✂️', '🎉'],
  },
  '2': {
    title: 'The Tortoise & The Hare',
    emoji: '🐢',
    color: ['#059669', '#34D399'],
    pages: [
      "The Hare was always bragging about how fast he could run.",
      "The Tortoise got tired of it and said, 'I bet I can beat you in a race!'",
      "The race started! The Hare ran so fast that he soon left the Tortoise far behind.",
      "The Hare thought, 'I have plenty of time. I think I'll take a nap.'",
      "While the Hare slept, the Tortoise kept walking and walking, never stopping.",
      "When the Hare woke up, he saw the Tortoise near the finish line! He ran as fast as he could.",
      "But the Tortoise crossed the line first! 'Slow and steady wins the race,' he said with a smile.",
    ],
    sceneEmoji: ['🏅', '🏁', '💨', '😴', '🚶', '😱', '🏆'],
  },
  '3': {
    title: 'Cinderella',
    emoji: '👸',
    color: ['#7C3AED', '#A78BFA'],
    pages: [
      "Cinderella was a kind girl who lived with her mean stepmother and sisters.",
      "A big ball was happening at the palace, but Cinderella wasn't allowed to go.",
      "Suddenly, her Fairy Godmother appeared! With a wave of her wand, Cinderella had a beautiful dress.",
      "She went to the ball and danced with the Prince all night long.",
      "At midnight, she had to run home, but she lost one of her glass slippers on the stairs.",
      "The Prince searched the whole kingdom to find the girl who fit the slipper.",
      "He found Cinderella, the slipper fit perfectly, and they lived happily ever after!",
    ],
    sceneEmoji: ['🏠', '🏰', '✨', '💃', '🕛', '👟', '💍'],
  },
  '4': {
    title: 'The Three Little Pigs',
    emoji: '🐷',
    color: ['#EC4899', '#F9A8D4'],
    pages: [
      "Three little pigs decided to build their own houses.",
      "The first pig built his house of straw. The second pig built his of sticks.",
      "The third pig worked very hard and built his house of strong bricks.",
      "A Big Bad Wolf came and blew down the straw house! The first pig ran to his brother's stick house.",
      "The Wolf blew down the stick house too! Both pigs ran to the brick house.",
      "The Wolf huffed and puffed, but he could NOT blow down the brick house!",
      "The Wolf went away, and the three little pigs lived together safely in the brick house.",
    ],
    sceneEmoji: ['🏗️', '🌾', '🪵', '💨', '🏃', '😤', '🎊'],
  },
  '5': {
    title: 'Jack & The Beanstalk',
    emoji: '🌱',
    color: ['#0891B2', '#67E8F9'],
    pages: [
      "Jack traded his cow for some magic beans. His mother was very angry!",
      "But overnight, a giant beanstalk grew all the way up to the clouds.",
      "Jack climbed up and found a giant's castle filled with gold.",
      "He found a hen that laid golden eggs and a magic singing harp.",
      "The Giant shouted, 'Fee-fi-fo-fum!' and chased Jack down the beanstalk.",
      "Jack chopped down the beanstalk, and the Giant couldn't catch him.",
      "Jack and his mother were never poor again!",
    ],
    sceneEmoji: ['🐄', '🌱', '☁️', '🥚', '👹', '🪓', '💰'],
  },
  '6': {
    title: 'Snow White',
    emoji: '🍎',
    color: ['#DC2626', '#F87171'],
    pages: [
      "Snow White was the fairest in all the land, which made the Queen very jealous.",
      "Snow White found a tiny cottage in the woods where seven dwarfs lived.",
      "She stayed with them and they became great friends.",
      "One day, the Queen tricked Snow White into eating a poisoned apple.",
      "Snow White fell into a deep sleep, and the dwarfs were very sad.",
      "A Prince came and kissed her, and she woke up from the magic sleep.",
      "Snow White and the Prince lived happily ever after in the palace!",
    ],
    sceneEmoji: ['👑', '🏡', '🤝', '🍎', '😴', '💋', '🏰'],
  }
};

export default function StoryReader() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const story = STORIES_DATA[id || '1'] || STORIES_DATA['1'];
  
  const [childId, setChildId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  // Floating emoji animation
  const floatAnim = useRef(new RNAnimated.Value(0)).current;
  useEffect(() => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(floatAnim, { toValue: -14, duration: 1200, useNativeDriver: true }),
        RNAnimated.timing(floatAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ])
    ).start();
  }, [floatAnim]);

  useEffect(() => {
    AsyncStorage.getItem('childId').then(id => setChildId(id));
  }, []);

  const handleNext = async () => {
    if (page < story.pages.length - 1) {
      setDirection('forward');
      setPage(p => p + 1);
    } else {
      if (childId) {
        await activityService.addActivity(`Read ${story.title} ${story.emoji}`, childId);
        await rewardService.updateRewards(childId, 3);
      }
      Alert.alert('🎉 The End!', 'Great reading! You earned 3 Stars! ⭐⭐⭐', [
        { text: 'Back to Stories', onPress: () => router.back() }
      ]);
    }
  };

  const handlePrev = () => {
    if (page > 0) {
      setDirection('back');
      setPage(p => p - 1);
    }
  };

  const entering = direction === 'forward' ? SlideInRight.springify().damping(20) : SlideInLeft.springify().damping(20);
  const exiting = direction === 'forward' ? SlideOutLeft : SlideOutRight;

  const progress = (page + 1) / story.pages.length;
  const currentScene = story.sceneEmoji?.[page] ?? story.emoji;

  return (
    <View style={[styles.container, { backgroundColor: story.color[0] + '12' }]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={story.color as any} style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{story.title}</Text>
        <View style={{ width: 44 }} />
      </LinearGradient>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <Animated.View
          style={[styles.progressFill, { backgroundColor: story.color[0], width: `${progress * 100}%` }]}
          entering={FadeIn}
        />
      </View>

      <View style={styles.readerArea}>
        <Animated.View key={page} entering={entering} exiting={exiting as any} style={styles.pageCard}>
          {/* Floating scene emoji */}
          <RNAnimated.Text style={[styles.sceneEmoji, { transform: [{ translateY: floatAnim }] }]}>
            {currentScene}
          </RNAnimated.Text>
          
          {/* Big story emoji */}
          <View style={styles.emojiContainer}>
            <Text style={styles.emojiLarge}>{story.emoji}</Text>
            <LottieView
              source={require('../../../assets/animation.json')}
              autoPlay
              loop
              style={styles.animation}
            />
          </View>

          {/* Page text */}
          <Text style={styles.pageText}>{story.pages[page]}</Text>

          {/* Star indicators */}
          <View style={styles.starsRow}>
            {story.pages.map((_, i) => (
              <Animated.View key={i} entering={ZoomIn.delay(i * 60)}>
                <Ionicons
                  name={i <= page ? 'star' : 'star-outline'}
                  size={14}
                  color={i <= page ? story.color[0] : '#D1D5DB'}
                />
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </View>

      <View style={[styles.controls, { shadowColor: story.color[0] }]}>
        <TouchableOpacity
          style={[styles.controlBtn, { backgroundColor: story.color[0] + '20' }, page === 0 && { opacity: 0.4 }]}
          onPress={handlePrev}
          disabled={page === 0}
        >
          <Ionicons name="chevron-back" size={22} color={story.color[0]} />
          <Text style={[styles.controlTxt, { color: story.color[0] }]}>Prev</Text>
        </TouchableOpacity>

        <Text style={styles.pageCounter}>
          {page + 1} / {story.pages.length}
        </Text>

        <TouchableOpacity
          style={[styles.controlBtn, { backgroundColor: story.color[0] }]}
          onPress={handleNext}
        >
          <Text style={styles.controlTxtWhite}>{page === story.pages.length - 1 ? 'Finish! 🎉' : 'Next'}</Text>
          {page < story.pages.length - 1 && <Ionicons name="chevron-forward" size={22} color="#FFF" />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  backBtn: { width: 44, height: 44, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  title: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '900', color: '#FFF' },
  progressBar: { height: 4, backgroundColor: '#E5E7EB', marginHorizontal: 0 },
  progressFill: { height: 4, borderRadius: 2 },
  readerArea: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  pageCard: {
    backgroundColor: '#FFF',
    borderRadius: 36,
    padding: 30,
    width: '100%',
    minHeight: 420,
    alignItems: 'center',
    elevation: 10,
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
  },
  sceneEmoji: { fontSize: 36, position: 'absolute', top: 16, right: 20 },
  emojiContainer: { position: 'relative', width: 110, height: 110, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  emojiLarge: { fontSize: 72 },
  animation: { position: 'absolute', width: 150, height: 150, opacity: 0.2 },
  pageText: { fontSize: 21, color: '#374151', textAlign: 'center', lineHeight: 33, fontWeight: '600', marginBottom: 24 },
  starsRow: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  controls: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 44,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    elevation: 20,
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  controlBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 20, gap: 4 },
  controlTxt: { fontWeight: '800', fontSize: 15 },
  controlTxtWhite: { color: '#FFF', fontWeight: '900', fontSize: 15 },
  pageCounter: { fontSize: 15, fontWeight: '900', color: '#94A3B8' },
});
