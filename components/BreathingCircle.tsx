import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing, withSequence } from 'react-native-reanimated';

export default function BreathingCircle() {
  const scale = useSharedValue(1);

  useEffect(() => {
    // 4 seconds breathe in, 2 seconds hold, 4 seconds breathe out
    scale.value = withRepeat(
      withSequence(
        withTiming(1.5, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.5, { duration: 2000 }), // hold
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }) // breathe out
      ),
      -1, // infinite loop
      true // reverse
    );
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.circle, animatedStyle]}>
        <View style={styles.innerCircle}>
          <Text style={styles.text}>Breathe</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#E6E6FA', // Soft Lavender
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#C1E1C1',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 10,
  },
  innerCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#888',
  },
});
