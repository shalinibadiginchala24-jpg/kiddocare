import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { KID_COLORS } from '@/constants/kidColors';

type RewardStarsProps = {
  stars: number;
  delay?: number;
};

export default function RewardStars({ stars, delay = 400 }: RewardStarsProps) {
  return (
    <Animated.View entering={ZoomIn.delay(delay).duration(1200).springify().damping(10)}>
      <View style={styles.starBadge}>
        <MaterialIcons name="star" size={50} color="#FFD700" />
        <Text style={styles.starText}>{stars} Stars</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  starBadge: {
    backgroundColor: KID_COLORS.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFD700',
    marginBottom: 40,
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  starText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: KID_COLORS.textPrimary,
    marginLeft: 10,
  },
});
