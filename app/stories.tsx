import { ScrollView, Text, View } from 'react-native';

export default function Stories() {
  return (
    <ScrollView style={{
      flex: 1,
      backgroundColor: '#FFFFFF',
      padding: 20
    }}>

      <Text style={{
        fontSize: 26,
        fontWeight: 'bold',
        color: '#A7C7E7',
        marginBottom: 20,
        textAlign: 'center'
      }}>
        Moral Stories 📚
      </Text>

      <View style={{
        backgroundColor: '#BEE3DB',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15
      }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          🦁 The Lion and the Mouse
        </Text>

        <Text style={{ marginTop: 10 }}>
          Moral: Kindness is never wasted.
        </Text>
      </View>

      <View style={{
        backgroundColor: '#FFF3B0',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15
      }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
          🐢 The Tortoise and the Hare
        </Text>

        <Text style={{ marginTop: 10 }}>
          Moral: Slow and steady wins the race.
        </Text>
      </View>

    </ScrollView>
  );
}