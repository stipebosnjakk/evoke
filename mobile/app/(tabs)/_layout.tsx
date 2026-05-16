import { View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";

import Header from "@/components/custom/Header";
import { routes } from "@/constants/routes";

type TabBarIconProps = {
  color: string;
  focused: boolean;
};

const TabLayout = () => {
  return (
    <View style={styles.root}>
      <Header />
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
            name={routes.today.route}
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
            name={routes.upcoming.route}
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
            name={routes.inbox.route}
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
            name={routes.projects.route}
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
