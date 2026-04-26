import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence, withSpring, withDelay } from 'react-native-reanimated';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { KID_COLORS } from '@/constants/kidColors';

export default function Logo({ size = 120, animated = false }: { size?: number, animated?: boolean }) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(animated ? 0 : 1);
  const teddyY = useSharedValue(animated ? -150 : 0);
  const starScale = useSharedValue(animated ? 0 : 1);

  useEffect(() => {
    if (animated) {
      scale.value = withSpring(1, { damping: 12 });
      teddyY.value = withDelay(400, withSpring(0, { damping: 10, mass: 1.2 }));
      starScale.value = withDelay(800, withSpring(1, { damping: 8, mass: 0.8 }));
    }

    rotation.value = withDelay(animated ? 1500 : 0, 
      withRepeat(
        withSequence(
          withTiming(-4, { duration: 1200 }),
          withTiming(4, { duration: 1200 })
        ),
        -1,
        true
      )
    );
  }, [animated, rotation, scale, starScale, teddyY]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }, { scale: scale.value }]
  }));

  const teddyStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: teddyY.value }]
  }));

  const starAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: '15deg' }, { scale: starScale.value }]
  }));

  const iconSize = size * 0.55;
  const starSize = size * 0.3;

  return (
    <Animated.View style={[styles.container, { width: size, height: size, borderRadius: size / 3 }, animatedContainerStyle]}>
      <Animated.View style={teddyStyle}>
        <MaterialCommunityIcons name="human-male-child" size={iconSize} color="#FFFFFF" />
      </Animated.View>
      <Animated.View style={[styles.starContainer, { right: size * 0.1, top: size * 0.05 }, starAnimatedStyle]}>
        <MaterialCommunityIcons name="star-four-points" size={starSize} color={KID_COLORS.badges} />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: KID_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: KID_COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 6,
    borderColor: '#FFF',
    overflow: 'hidden',
  },
  starContainer: {
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    transform: [{ rotate: '15deg' }]
  }
});
