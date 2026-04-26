import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring 
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

// ── Pressable Scale Component ────────────────────────────────────────────────
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

const STORIES = [
  { id: '1', title: 'The Lion & The Mouse', emoji: '🦁', color: ['#FFDAC1', '#FFB347'] as const, age: '4+', pages: '12 pages' },
  { id: '2', title: 'The Tortoise & The Hare', emoji: '🐢', color: ['#B5EAD7', '#98FB98'] as const, age: '5+', pages: '10 pages' },
  { id: '3', title: 'Cinderella', emoji: '👸', color: ['#C7CEEA', '#E2D1F9'] as const, age: '4+', pages: '18 pages' },
  { id: '4', title: 'The Three Little Pigs', emoji: '🐷', color: ['#FFD1DC', '#FFB7C5'] as const, age: '3+', pages: '14 pages' },
  { id: '5', title: 'Jack & The Beanstalk', emoji: '🌱', color: ['#B2E2F2', '#A1C4FD'] as const, age: '5+', pages: '16 pages' },
  { id: '6', title: 'Snow White', emoji: '🍎', color: ['#FFF9C4', '#FFF176'] as const, age: '4+', pages: '20 pages' },
];

export default function ChildStories() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_childId, setChildId] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('childId').then(id => {
      setChildId(id);
    });
  }, []);

  const handleRead = (story: typeof STORIES[0]) => {
    router.push({
      pathname: '/(child)/stories/reader',
      params: { id: story.id }
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#FAFAFA' }}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient 
        colors={['#E2D1F9', '#C7CEEA']} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }} 
        style={styles.header}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Story Time 📚</Text>
          <Text style={styles.sub}>Pick a story and start reading!</Text>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {STORIES.map((story, i) => (
          <Animated.View key={story.id} entering={FadeInDown.delay(i * 80).duration(600).springify()}>
            <PressableScale onPress={() => handleRead(story)} style={[styles.card, { backgroundColor: story.color[0] }]}>
              <LinearGradient 
                colors={story.color} 
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 0 }} 
                style={styles.cardGradient}
              >
                <View style={styles.emojiWrapper}>
                  <Text style={styles.emoji}>{story.emoji}</Text>
                  <LottieView
                    source={require('../../../assets/animation.json')}
                    autoPlay
                    loop
                    style={styles.lottie}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 16 }}>
                  <Text style={styles.storyTitle}>{story.title}</Text>
                  <Text style={styles.storySub}>{story.age} • {story.pages}</Text>
                </View>
                <View style={styles.readBtnCircle}>
                  <Text style={styles.readBtn}>📖</Text>
                </View>
              </LinearGradient>
            </PressableScale>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 32, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  title: { fontSize: 32, fontWeight: '900', color: '#4A4A4A' },
  sub: { fontSize: 16, color: '#6B7280', marginTop: 6, fontWeight: '600' },
  card: { borderRadius: 24, marginBottom: 16, overflow: 'hidden', elevation: 0, shadowOpacity: 0.05, shadowRadius: 15, shadowOffset: { width: 0, height: 10 } },
  cardGradient: { padding: 20, flexDirection: 'row', alignItems: 'center' },
  emojiWrapper: { position: 'relative', width: 50, height: 50, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.4)', borderRadius: 25 },
  emoji: { fontSize: 32 },
  lottie: { position: 'absolute', width: 65, height: 65, opacity: 0.3 },
  storyTitle: { fontSize: 18, fontWeight: '900', color: '#4A4A4A' },
  storySub: { fontSize: 13, color: 'rgba(0,0,0,0.5)', marginTop: 4, fontWeight: '600' },
  readBtnCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  readBtn: { fontSize: 18 },
});
