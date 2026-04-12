import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '@/contexts/AppContext';
import Animated, { FadeInDown, ZoomIn, FadeOutDown, FadeInUp } from 'react-native-reanimated';

export default function ChildDashboard() {
  const router = useRouter();
  const { stars, tasks } = useAppContext();
  
  // PIN Logic inside the dashboard
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const CORRECT_PIN = '1234';

  const completedCount = tasks.filter(t => t.completed).length;

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length === 4) {
        setTimeout(() => {
          if (newPin === CORRECT_PIN) {
            setIsUnlocked(true); // Unlock dashboard
          } else {
            Alert.alert('Oops! 🎈', 'Wrong PIN. Try 1234!');
            setPin('');
          }
        }, 150); // slight delay to visually show the 4th dot filling!
      }
    }
  };

  const handleClear = () => setPin('');

  // If NOT unlocked, render the PIN Pad
  if (!isUnlocked) {
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>
          Enter PIN 🔐
        </Text>
        
        <View style={styles.pinContainer}>
          {[0, 1, 2, 3].map((_, index) => (
            <View key={index} style={[styles.dot, pin.length > index && styles.dotFilled]} />
          ))}
        </View>

        <View style={styles.keypad}>
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <TouchableOpacity key={num} style={styles.key} onPress={() => handlePress(num)}>
              <Text style={styles.keyText}>{num}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.key} onPress={handleClear}>
            <Text style={styles.keyText}>C</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.key} onPress={() => handlePress('0')}>
            <Text style={styles.keyText}>0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.key} onPress={() => router.push('/role')}>
            <Text style={[styles.keyText, { fontSize: 18 }]}>Quit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // If UNLOCKED, render the Dashboard
  return (
    <View style={styles.container}>
      <Animated.Text 
        entering={FadeInDown.duration(1500).springify().damping(16)} 
        style={styles.welcomeText}
      >
        Welcome Kiddo! 🎈
      </Animated.Text>
      
      <View style={styles.grid}>
        {/* TASKS CARD */}
        <Animated.View entering={FadeInDown.delay(400).duration(1200).springify().damping(12)}>
          <TouchableOpacity style={[styles.card, { backgroundColor: '#AEC6CF' }]} onPress={() => router.push('/(child)/(tabs)/tasks')}>
            <MaterialIcons name="checklist" size={60} color="#333" />
            <Text style={styles.cardText}>Tasks 🎯</Text>
            <Text style={styles.cardSub}>{tasks.length - completedCount} left</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* REWARDS CARD */}
        <Animated.View entering={FadeInDown.delay(700).duration(1200).springify().damping(12)}>
          <TouchableOpacity style={[styles.card, { backgroundColor: '#FFD1DC' }]}>
            <MaterialIcons name="star" size={60} color="#FFD700" />
            <Text style={styles.cardText}>Rewards ⭐</Text>
            <Text style={styles.cardSub}>{stars} Stars</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* PROGRESS CARD */}
        <Animated.View entering={FadeInDown.delay(1000).duration(1200).springify().damping(12)}>
          <TouchableOpacity style={[styles.card, { backgroundColor: '#98FF98', width: 320, height: 160, flexDirection: 'row', justifyContent: 'space-around' }]}>
            <View style={{ alignItems: 'center' }}>
              <MaterialIcons name="bar-chart" size={60} color="#333" />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={styles.cardText}>Progress 📊</Text>
              <Text style={styles.cardSub}>{completedCount} Completed</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Clean background
    alignItems: 'center',
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#333',
    marginBottom: 40,
    marginTop: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 10,
  },
  card: {
    width: 150,
    height: 180,
    borderRadius: 30, // Heavily rounded
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 15,
    elevation: 6,
    padding: 10,
  },
  cardText: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 15,
    color: '#333',
  },
  cardSub: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginTop: 5,
  },
  pinContainer: {
    flexDirection: 'row',
    marginBottom: 50,
  },
  dot: {
    width: 25,
    height: 25,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 15,
  },
  dotFilled: {
    backgroundColor: '#AEC6CF', // Soft baby blue
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 320,
  },
  key: {
    width: 85,
    height: 85,
    borderRadius: 45,
    backgroundColor: '#FFF8D6', // Soft pale yellow
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4,
  },
  keyText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#333',
  },
});
