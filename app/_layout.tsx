import 'react-native-gesture-handler'; // Required for Drawer
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import Animated from 'react-native-reanimated';
import { enableLayoutAnimations } from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProvider } from '../contexts/AppContext';
import { Platform, Text } from 'react-native';
import { useFonts, Baloo2_500Medium, Baloo2_700Bold } from '@expo-google-fonts/baloo-2';

// ── Fix: Reanimated layout animations cause DOM removeChild errors on web ──────
if (Platform.OS === 'web') {
  enableLayoutAnimations(false);
  
  try {
    const components = ['View', 'Text', 'Image', 'ScrollView', 'FlatList'];
    components.forEach((comp) => {
      // @ts-ignore
      if (Animated && Animated[comp]) {
        // @ts-ignore
        const OriginalComp = Animated[comp];
        const PatchedComp = React.forwardRef((props: any, ref: any) => {
          const { entering, exiting, layout, ...rest } = props;
          return <OriginalComp ref={ref} {...rest} />;
        });
        PatchedComp.displayName = `PatchedAnimated${comp}`;
        // @ts-ignore
        Animated[comp] = PatchedComp;
      }
    });
  } catch (e) {
    console.warn('Failed to monkey-patch Reanimated components:', e);
  }
}

// Global seamless font patch for React Native elements
// @ts-ignore
if (Text.defaultProps == null) (Text as any).defaultProps = {};
// @ts-ignore
(Text as any).defaultProps.style = { fontFamily: 'Baloo2_500Medium' };

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  let [fontsLoaded] = useFonts({
    Baloo2_500Medium,
    Baloo2_700Bold,
  });

  if (!fontsLoaded) {
    return null; // Don't render until custom fonts are loaded to avoid layout jumps
  }

  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="login" />
          <Stack.Screen name="parent-login" />
          <Stack.Screen name="child-login" />
          <Stack.Screen name="(parent)" />
          <Stack.Screen name="(child)" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppProvider>
  );
}
