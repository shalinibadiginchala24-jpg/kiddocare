import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function ChildDashboard() {
  const router = useRouter();

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#FFFFFF',
      padding: 20,
      justifyContent: 'center'
    }}>

      {/* Title */}
      <Text style={{
        fontSize: 26,
        textAlign: 'center',
        marginBottom: 30,
        color: '#CDB4DB',
        fontWeight: 'bold'
      }}>
        Hi Kiddo 👶
      </Text>

      {/* Tasks */}
      <TouchableOpacity
        onPress={() => router.push('/tasks')}
        style={{
          backgroundColor: '#BEE3DB',
          padding: 18,
          borderRadius: 15,
          marginBottom: 15
        }}
      >
        <Text style={{ textAlign: 'center', fontSize: 18 }}>
          ✅ Tasks
        </Text>
      </TouchableOpacity>

      {/* Stories */}
      <TouchableOpacity
        onPress={() => router.push('/stories')}
        style={{
          backgroundColor: '#FFF3B0',
          padding: 18,
          borderRadius: 15,
          marginBottom: 15
        }}
      >
        <Text style={{ textAlign: 'center', fontSize: 18 }}>
          📚 Stories
        </Text>
      </TouchableOpacity>

      {/* Games */}
      <TouchableOpacity
        onPress={() => router.push('/coloring')}
        style={{
          backgroundColor: '#F7C8E0',
          padding: 18,
          borderRadius: 15,
          marginBottom: 15
        }}
      >
        <Text style={{ textAlign: 'center', fontSize: 18 }}>
          🎨 Coloring
        </Text>
      </TouchableOpacity>

      {/* SOS */}
      <TouchableOpacity
        onPress={() => alert('SOS Sent 🚨')}
        style={{
          backgroundColor: '#FF6B6B',
          padding: 18,
          borderRadius: 15,
          marginTop: 20
        }}
      >
        <Text style={{
          textAlign: 'center',
          fontSize: 18,
          color: 'white',
          fontWeight: 'bold'
        }}>
          🚨 SOS
        </Text>
      </TouchableOpacity>

    </View>
  );
}