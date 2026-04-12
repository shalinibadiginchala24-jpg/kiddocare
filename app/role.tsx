import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function RoleSelection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Animated.Text entering={FadeInDown.duration(1200)} style={styles.title}>
        Who are you?
      </Animated.Text>

      <Animated.View entering={FadeInDown.delay(300).duration(1500).springify().damping(12)}>
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: '#AEC6CF' }]} 
          onPress={() => router.push('/(parent)/login')}
        >
          <Text style={styles.emoji}>👨‍👩‍👧</Text>
          <Text style={styles.cardText}>Parent</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(600).duration(1500).springify().damping(12)}>
        <TouchableOpacity 
          style={[styles.card, { backgroundColor: '#E6E6FA' }]}
          onPress={() => router.push('/(child)/(tabs)')}
        >
          <Text style={styles.emoji}>🧸</Text>
          <Text style={styles.cardText}>Child</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF6E5', // Soft pastel background matching intro
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 50,
    color: '#333',
  },
  card: {
    width: 250,
    padding: 30,
    borderRadius: 30, // Heavily rounded
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 24,
    color: '#333',
    fontWeight: 'bold',
  },
});
