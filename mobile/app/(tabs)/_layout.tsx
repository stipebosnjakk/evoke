import Header from "@/components/custom/Header";
import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        header: (props) => <Header {...props} />,
        tabBarStyle: {
          paddingTop: 6,
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={focused ? "sun.max.fill" : "sun.max"}
              size={30}
              type="monochrome"
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: "Plan",
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={focused ? "rectangle.grid.1x2.fill" : "rectangle.grid.1x2"}
              size={30}
              type="monochrome"
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Inbox",
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={focused ? "tray.fill" : "tray"}
              size={30}
              type="monochrome"
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={focused ? "folder.fill" : "folder"}
              size={30}
              type="monochrome"
              tintColor={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
