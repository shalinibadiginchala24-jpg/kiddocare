import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function ChildLogin() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const CORRECT_PIN = '1234';

  const handlePress = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          router.replace('/(child)/(tabs)');
        } else {
          Alert.alert('Oops!', 'Wrong PIN. (Hint: It is 1234)');
          setPin('');
        }
      }
    }
  };

  const handleClear = () => {
    setPin('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter PIN 🔐</Text>
      
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
        <TouchableOpacity style={styles.key} onPress={() => router.replace('/role')}>
          <Text style={[styles.keyText, { fontSize: 16 }]}>Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF3B0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  pinContainer: {
    flexDirection: 'row',
    marginBottom: 50,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#rgba(0,0,0,0.1)',
    marginHorizontal: 10,
  },
  dotFilled: {
    backgroundColor: '#4A90E2',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 300,
  },
  key: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  keyText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
  },
});
