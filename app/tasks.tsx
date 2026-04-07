import { Text, TouchableOpacity, View } from 'react-native';

export default function Tasks() {
  return (
    <View style={{
      flex: 1,
      backgroundColor: '#FFFFFF',
      padding: 20
    }}>

      <Text style={{
        fontSize: 26,
        fontWeight: 'bold',
        color: '#CDB4DB',
        marginBottom: 20,
        textAlign: 'center'
      }}>
        Today's Tasks ✅
      </Text>

      {/* Task 1 */}
      <TouchableOpacity style={{
        backgroundColor: '#BEE3DB',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15
      }}>
        <Text style={{ fontSize: 18 }}>
          🍎 Eat Healthy Food
        </Text>
      </TouchableOpacity>

      {/* Task 2 */}
      <TouchableOpacity style={{
        backgroundColor: '#FFF3B0',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15
      }}>
        <Text style={{ fontSize: 18 }}>
          📚 Do Homework
        </Text>
      </TouchableOpacity>

      {/* Task 3 */}
      <TouchableOpacity style={{
        backgroundColor: '#F7C8E0',
        padding: 15,
        borderRadius: 15
      }}>
        <Text style={{ fontSize: 18 }}>
          🦷 Brush Teeth
        </Text>
      </TouchableOpacity>

    </View>
  );
}