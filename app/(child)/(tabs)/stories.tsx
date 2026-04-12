import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";

export default function Stories() {
  return (
    <ScrollView style={styles.container}>
      <Animated.Text entering={ZoomIn.duration(1200)} style={styles.header}>
        Story Time! 🧸
      </Animated.Text>

      <Animated.View
        entering={FadeInDown.delay(300).duration(1500).springify().damping(12)}
      >
        <View style={[styles.storyCard, { backgroundColor: "#FFD1DC" }]}>
          <Text style={styles.storyTitle}>🦁 The Lion & Mouse</Text>
          <Text style={styles.storyText}>
            A tiny mouse helps a huge lion! Even little friends can do big
            things!
          </Text>
        </View>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(600).duration(1500).springify().damping(12)}
      >
        <View style={[styles.storyCard, { backgroundColor: "#E6E6FA" }]}>
          <Text style={styles.storyTitle}>🐢 Tortoise & Hare</Text>
          <Text style={styles.storyText}>
            Slow and steady wins the race. Keep trying your best!
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFB6C1", // Soft pink heading
    marginBottom: 20,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.05)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  storyCard: {
    padding: 25,
    borderRadius: 30, // Smooth bubbly corners
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 4,
  },
  storyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  storyText: {
    fontSize: 18,
    color: "#444",
    lineHeight: 28,
    fontWeight: "500",
  },
});
