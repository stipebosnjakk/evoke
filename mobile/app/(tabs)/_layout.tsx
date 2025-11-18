import { Tabs, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
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
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={focused ? "house.fill" : "house"}
              size={30}
              type="monochrome"
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="focus"
        options={{
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="target"
              size={30}
              type="monochrome"
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
            router.push("/create-modal");
          },
        })}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={focused ? "plus.app.fill" : "plus.app"}
              size={30}
              type="monochrome"
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={focused ? "chart.bar.fill" : "chart.bar"}
              size={30}
              type="monochrome"
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <SymbolView
              name={focused ? "person.fill" : "person"}
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
