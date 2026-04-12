import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { ZoomInEasyDown, FadeIn, withRepeat, withTiming, withSequence, useAnimatedStyle } from 'react-native-reanimated';
import { useEffect } from 'react';

export default function Games() {
  
  // A subtle breathing animation for the icon
  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          scale: withRepeat(
            withSequence(
              withTiming(1.1, { duration: 2500 }),
              withTiming(1.0, { duration: 2500 })
            ),
            -1, // infinite
            true
          )
        }
      ]
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={animatedIconStyle}>
        <MaterialIcons name="sports-esports" size={120} color="#FFFFFF" />
      </Animated.View>
      
      <Animated.Text entering={ZoomInEasyDown.delay(300).duration(1500).springify().damping(12)} style={styles.title}>
        Games! 🎮
      </Animated.Text>
      
      <Animated.Text entering={FadeIn.delay(800).duration(2000)} style={styles.subtitle}>
        Fun mini-games coming soon!
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#98FF98', // Soft Mint green background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 20,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#333',
    marginTop: 10,
    fontWeight: 'bold',
    opacity: 0.8,
  },
});
