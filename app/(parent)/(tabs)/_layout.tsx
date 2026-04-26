import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";

export default function ParentTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#7C3AED",
        tabBarInactiveTintColor: "#9CA3AF",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: 68,
          paddingBottom: 12,
          paddingTop: 8,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#7C3AED',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 20,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <View style={{ alignItems: 'center' }}>
              <MaterialIcons name="dashboard" size={26} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: "Assign",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="add-task" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: "Activity",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="analytics" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="notifications-active" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
