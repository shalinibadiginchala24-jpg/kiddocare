import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

type ProgressBarProps = {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
};

export default function ProgressBar({ progress, color = '#C1E1C1', height = 15 }: ProgressBarProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: withSpring(`${progress * 100}%`, { damping: 15, stiffness: 90 }),
    };
  });

  return (
    <View style={[styles.container, { height }]}>
      <Animated.View style={[styles.fill, animatedStyle, { backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FBF9F6', // Warm Pearl empty track
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#EAEAEA',
  },
  fill: {
    height: '100%',
    borderRadius: 15,
  },
});
