import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function ChildTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F472B6",
        tabBarInactiveTintColor: "#9CA3AF",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          height: 68,
          paddingBottom: 12,
          paddingTop: 8,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#F472B6',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
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
            <MaterialIcons name="home" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          href: null,
          title: "Tasks",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="checklist" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stories"
        options={{
          href: null,
          title: "Stories",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="menu-book" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="games"
        options={{
          href: null,
          title: "Games",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="games" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: "SOS",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="campaign" size={26} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
