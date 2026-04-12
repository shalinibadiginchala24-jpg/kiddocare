import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppContext } from '@/contexts/AppContext';

export default function SOSScreen() {
  const { triggerSOS } = useAppContext();

  const handleSOS = () => {
    triggerSOS();
    Alert.alert('SOS Triggered! 🚨', 'Your parents have been alerted immediately!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Need Help? 🚨</Text>
      
      <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
        <MaterialIcons name="campaign" size={120} color="#FFF" />
        <Text style={styles.sosText}>SOS!</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Tap the loud button to call your parents.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 40,
    color: '#333',
  },
  sosButton: {
    width: 250,
    height: 250,
    borderRadius: 125, // Perfectly round
    backgroundColor: '#FF6B6B', // Loud red
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF6B6B',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
    borderWidth: 8,
    borderColor: '#FFE0E0', 
    marginBottom: 40,
  },
  sosText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFF',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
