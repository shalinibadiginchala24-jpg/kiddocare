import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { KID_COLORS } from '@/constants/kidColors';

type MoodTrackerProps = {
  mood: string | null;
  setMood: (mood: string) => void;
  delay?: number;
};

export default function MoodTracker({ mood, setMood, delay = 200 }: MoodTrackerProps) {
  const moods = [
    { emoji: '😊', label: 'Happy', color: '#FFD93D' },
    { emoji: '😌', label: 'Calm', color: KID_COLORS.primary },
    { emoji: '😢', label: 'Sad', color: '#A0AEC0' },
    { emoji: '😡', label: 'Angry', color: '#FF6B6B' },
  ];

  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(1200).springify().damping(12)} style={styles.section}>
      <Text style={styles.sectionTitle}>How are you feeling?</Text>
      <View style={styles.moodRow}>
        {moods.map((m) => (
          <TouchableOpacity 
            key={m.label} 
            style={[styles.moodBubble, { backgroundColor: mood === m.label ? m.color : '#F0F0F0' }]}
            onPress={() => setMood(m.label)}
          >
            <Text style={styles.moodEmoji}>{m.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  section: {
    width: '100%',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: KID_COLORS.textPrimary,
    marginBottom: 15,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodBubble: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  moodEmoji: {
    fontSize: 36,
  },
});
