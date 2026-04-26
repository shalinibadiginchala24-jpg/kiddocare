import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  FadeInUp,
  BounceIn,
  ZoomIn,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { FlatList } from 'react-native';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Intelligent Child Protection',
    subtitle: 'Advanced monitoring that proactively safeguards your child from digital risks.',
    icon: 'shield-checkmark',
    colors: ['#FF9A9E', '#FECFEF'] as const,
    ringColor: '#FF9A9E',
    iconColor: '#FFF',
    bg: '#FAFAFA',
  },
  {
    id: '2',
    title: 'Real-Time Location Awareness',
    subtitle: 'Stay connected with precise, live tracking — because every moment matters.',
    icon: 'location',
    colors: ['#A18CD1', '#FBC2EB'] as const,
    ringColor: '#A18CD1',
    iconColor: '#FFF',
    bg: '#FAFAFA',
  },
  {
    id: '3',
    title: 'Habit Building That Lasts',
    subtitle: 'Turn daily routines into achievements with structured tasks and meaningful rewards.',
    icon: 'trophy',
    colors: ['#84FAB0', '#8FD3F4'] as const,
    ringColor: '#84FAB0',
    iconColor: '#FFF',
    bg: '#FAFAFA',
  },
  {
    id: '4',
    title: 'Safe Digital Lifestyle',
    subtitle: 'Smart insights to guide healthy screen time and mindful device usage.',
    icon: 'hourglass',
    colors: ['#FCCB90', '#D57EEB'] as const,
    ringColor: '#D57EEB',
    iconColor: '#FFF',
    bg: '#FAFAFA',
  },
  {
    id: '5',
    title: 'AI Companion You Can Trust',
    subtitle: 'A secure, intelligent assistant designed to support, guide, and engage your child.',
    icon: 'hardware-chip',
    colors: ['#E0C3FC', '#8EC5FC'] as const,
    ringColor: '#8EC5FC',
    iconColor: '#FFF',
    bg: '#FAFAFA',
  }
];

function SlideItem({ item, index, scrollX }: { item: typeof slides[0]; index: number; scrollX: { value: number } }) {
  const animStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    const scale = interpolate(scrollX.value, inputRange, [0.88, 1, 0.88], Extrapolation.CLAMP);
    const opacity = interpolate(scrollX.value, inputRange, [0.55, 1, 0.55], Extrapolation.CLAMP);
    const translateY = interpolate(scrollX.value, inputRange, [24, 0, 24], Extrapolation.CLAMP);
    return { transform: [{ scale }, { translateY }], opacity };
  });

  return (
    <Animated.View style={[styles.slide, { backgroundColor: item.bg }, animStyle]}>
      <Animated.View entering={BounceIn.delay(index * 80).springify()} style={styles.imageContainer}>
        <LinearGradient
          colors={item.colors}
          style={[styles.iconCircle, { shadowColor: item.ringColor }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name={item.icon as any} size={72} color={item.iconColor} />
        </LinearGradient>
        {/* Decorative concentric rings */}
        <Animated.View entering={ZoomIn.delay(200).springify()} style={[styles.ring, styles.ring1, { borderColor: item.ringColor + '40' }]} />
        <Animated.View entering={ZoomIn.delay(400).springify()} style={[styles.ring, styles.ring2, { borderColor: item.ringColor + '20' }]} />
      </Animated.View>

      <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.textContainer}>
        <Text style={[styles.title, { color: '#1F2937' }]}>{item.title}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </Animated.View>
    </Animated.View>
  );
}

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems?.[0]) setCurrentIndex(viewableItems[0].index ?? 0);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      router.replace('/login');
    }
  };

  const skip = () => router.replace('/login');
  const slide = slides[currentIndex];

  const dotStyle = (i: number) =>
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useAnimatedStyle(() => {
      const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
      const dotWidth = interpolate(scrollX.value, inputRange, [7, 22, 7], Extrapolation.CLAMP);
      const opacity = interpolate(scrollX.value, inputRange, [0.35, 1, 0.35], Extrapolation.CLAMP);
      return { width: dotWidth, opacity };
    });

  return (
    <View style={[styles.container, { backgroundColor: slide.bg }]}>
      <Animated.FlatList
        ref={flatListRef as any}
        data={slides}
        renderItem={({ item, index }) => <SlideItem item={item} index={index} scrollX={scrollX} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
      />

      <View style={styles.bottomContainer}>
        <View style={styles.paginatorContainer}>
          {slides.map((s, i) => (
            <Animated.View
              key={i}
              style={[styles.dot, dotStyle(i), { backgroundColor: s.ringColor }]}
            />
          ))}
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={skip} style={styles.skipButton}>
            <Text style={[styles.skipText, { color: slide.ringColor }]}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={scrollToNext} style={styles.nextWrapper}>
            <LinearGradient
              colors={slide.colors}
              style={styles.nextButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={[styles.nextButtonText, { color: slide.iconColor }]}>
                {currentIndex === slides.length - 1 ? '🚀 Get Started' : 'Next →'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    paddingTop: height * 0.08,
  },
  imageContainer: {
    flex: 0.52,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconCircle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  ring: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1.5,
  },
  ring1: { width: 235, height: 235 },
  ring2: { width: 284, height: 284 },
  textContainer: {
    flex: 0.48,
    paddingHorizontal: 38,
    alignItems: 'center',
    width: '100%',
    paddingTop: 36,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingBottom: 48,
    paddingHorizontal: 32,
  },
  paginatorContainer: {
    flexDirection: 'row',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  dot: { height: 7, borderRadius: 4 },
  buttonsContainer: { flexDirection: 'row', alignItems: 'center' },
  skipButton: { paddingVertical: 16, paddingHorizontal: 16 },
  skipText: { fontSize: 16, fontWeight: '700' },
  nextWrapper: { flex: 1, marginLeft: 16 },
  nextButton: {
    paddingVertical: 17,
    borderRadius: 30,
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  nextButtonText: { fontSize: 17, fontWeight: '900', letterSpacing: 0.3 },
});
