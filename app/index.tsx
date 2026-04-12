import { View } from 'react-native';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/intro');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#CDB4DB'
    }}>
      
      <LottieView
        source={require('../assets/animation.json')} 
        autoPlay
        loop
        style={{ width: 250, height: 250 }}
      />

    </View>
  );
}
