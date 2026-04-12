import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function ChildTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FF8FAB", // Warm pink active tint
        tabBarInactiveTintColor: "#AEC6CF", // Baby blue inactive
        headerShown: true,
        headerStyle: {
          backgroundColor: "#FFD1DC", // Soft pink header
        },
        headerTintColor: "#333",
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
        },
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: 65,
          paddingBottom: 10,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home ✨",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks 📋",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="checklist" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stories"
        options={{
          title: "Stories 📚",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="menu-book" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          title: "Games 🎮",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="games" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: "SOS 🚨",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="campaign" size={28} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
