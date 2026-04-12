import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp, withRepeat, withTiming, withSequence, useAnimatedStyle } from 'react-native-reanimated';

export default function Intro() {
  const router = useRouter();

  // Floating bubble animation logic
  const createFloatingStyle = (duration: number) => useAnimatedStyle(() => {
    return {
      transform: [
        { 
          translateY: withRepeat(
            withSequence(
              withTiming(-20, { duration }),
              withTiming(0, { duration })
            ),
            -1,
            true
          )
        }
      ]
    };
  });

  return (
    <View style={styles.container}>
      {/* Floating Background Bubbles */}
      <Animated.View style={[styles.bubble, styles.bubble1, createFloatingStyle(2000)]} />
      <Animated.View style={[styles.bubble, styles.bubble2, createFloatingStyle(3000)]} />
      <Animated.View style={[styles.bubble, styles.bubble3, createFloatingStyle(2500)]} />

      <Animated.Text
        entering={FadeInDown.duration(1500).springify().damping(12)}
        style={styles.title}
      >
        Welcome to KiddoCare
      </Animated.Text>

      <Animated.Text
        entering={FadeInDown.delay(500).duration(1500).springify().damping(14)}
        style={styles.subtitle}
      >
        Learn, Play, Grow 🌈
      </Animated.Text>

      <Animated.View entering={FadeInUp.delay(1000).duration(1500).springify()}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/role')}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </Animated.View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF6E5', // Soft pastel cream
  },
  title: {
    fontSize: 36,
    marginBottom: 10,
    fontWeight: '900',
    color: '#333',
    textAlign: 'center',
    zIndex: 10,
  },
  subtitle: {
    fontSize: 22,
    color: '#888',
    fontWeight: 'bold',
    marginBottom: 50,
    zIndex: 10,
  },
  button: {
    backgroundColor: '#FFD1DC', // Soft Pink
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30, // Soft rounded
    shadowColor: '#FFD1DC',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
    zIndex: 10,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  bubble: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.5,
  },
  bubble1: {
    width: 100,
    height: 100,
    backgroundColor: '#AEC6CF', // Baby Blue
    top: 100,
    left: -20,
  },
  bubble2: {
    width: 60,
    height: 60,
    backgroundColor: '#98FF98', // Mint
    top: 250,
    right: 20,
  },
  bubble3: {
    width: 150,
    height: 150,
    backgroundColor: '#E6E6FA', // Lavender
    bottom: -30,
    left: 50,
  },
});
