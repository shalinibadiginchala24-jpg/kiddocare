import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email === '' || password === '') {
      alert('Please enter email and password');
    } else {
      alert(`Welcome ${email}`);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 20 }}>
        Login
      </Text>

      <TextInput
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          marginBottom: 10,
          padding: 10,
          borderRadius: 5,
        }}
      />

      <TextInput
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          borderWidth: 1,
          marginBottom: 20,
          padding: 10,
          borderRadius: 5,
        }}
      />

      <Button title="Login" onPress={handleLogin} />

    </View>
  );
}