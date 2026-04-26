import { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeIn, ZoomIn, Easing } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    let exitTimer: any;

    const bootstrap = async () => {
      // Show splash for 3 seconds then decide where to go
      exitTimer = setTimeout(async () => {
        // Temporarily disable auto-login so you can see the onboarding:
        // const parentId = await AsyncStorage.getItem('parentId');
        // if (parentId) {
        //   router.replace('/(parent)/(tabs)');
        //   return;
        // }

        // const childId = await AsyncStorage.getItem('childId');
        // if (childId) {
        //   router.replace('/(child)/(tabs)');
        //   return;
        // }

        // Fresh user or no session: go to onboarding
        router.replace("/onboarding");
      }, 3000);
    };

    bootstrap();

    return () => {
      if (exitTimer) clearTimeout(exitTimer);
    };
  }, []);

  return (
    <LinearGradient
      colors={["#0F0024", "#2D0A6E", "#5B21B6", "#7C3AED"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <Animated.Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
          entering={ZoomIn.duration(1200)
            .easing(Easing.out(Easing.cubic))
            .delay(200)}
        />

        <Animated.Text
          entering={FadeIn.duration(1400).delay(900)}
          style={styles.quote}
        >
          {'"Because every child deserves a safer digital world."'}
        </Animated.Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 40,
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
  },
  quote: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "600",
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    fontStyle: "italic",
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
