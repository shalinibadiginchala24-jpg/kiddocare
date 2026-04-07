import { Text, TouchableOpacity, View } from 'react-native';

export default function Coloring() {
  return (
    <View style={{
      flex: 1,
      backgroundColor: '#FFFFFF',
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center'
    }}>

      <Text style={{
        fontSize: 26,
        fontWeight: 'bold',
        color: '#F7C8E0',
        marginBottom: 30
      }}>
        Coloring Game 🎨
      </Text>

      <TouchableOpacity style={{
        backgroundColor: '#BEE3DB',
        padding: 20,
        borderRadius: 20
      }}>
        <Text style={{
          fontSize: 18
        }}>
          Start Coloring 🖍️
        </Text>
      </TouchableOpacity>

    </View>
  );
}