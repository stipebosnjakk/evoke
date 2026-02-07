import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Tabs, useSegments } from "expo-router";
import { SymbolView } from "expo-symbols";

import Header from "@/components/custom/Header";
import { TITLE_BY_ROUTE } from "@/lib/routes";

type TabBarIconProps = {
  color: string;
  focused: boolean;
};

const TabLayout = () => {
  const segments = useSegments();
  const activeRaw = segments[segments.length - 1];
  const active = activeRaw === "(tabs)" ? "index" : activeRaw;

  const [title, setTitle] = useState(TITLE_BY_ROUTE[active] || TITLE_BY_ROUTE.index);

  useEffect(() => {
    setTitle((prev) => TITLE_BY_ROUTE[active] ?? prev);
  }, [active]);

  return (
    <View style={styles.root}>
      <Header title={title} />
      <View style={styles.tabsWrap}>
        <Tabs
          screenOptions={{
            headerShown: false,
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
              tabBarIcon: ({ color, focused }: TabBarIconProps) => (
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
              tabBarIcon: ({ color, focused }: TabBarIconProps) => (
                <SymbolView
                  name={
                    focused ? "rectangle.grid.1x2.fill" : "rectangle.grid.1x2"
                  }
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
              tabBarIcon: ({ color, focused }: TabBarIconProps) => (
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
              tabBarIcon: ({ color, focused }: TabBarIconProps) => (
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "white",
  },
  tabsWrap: {
    flex: 1,
  },
});

export default TabLayout;
