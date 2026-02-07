import { useEffect } from "react";
import { Text, View } from "react-native";
import { Provider } from "react-redux";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as SQLite from "expo-sqlite";

// TODO: quick add creation inbox placement task

import "@/global.css";
import { store } from "@/store/store";
import migrations from "@/drizzle/migrations";
import { db } from "@/db/client";

const RootLayout = () => {
  // TODO: on loading data, check if migrations = success, then render DB and Redux
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (!__DEV__) return;
    const deleteDb = async () => {
      await SQLite.deleteDatabaseAsync(process.env.EXPO_PUBLIC_DATABASE_NAME!);
    };
    // deleteDb();
  }, []);

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="quick-add"
          options={{
            presentation: "formSheet",
            sheetAllowedDetents: "fitToContents",
            sheetGrabberVisible: true,
            sheetCornerRadius: 16,
            sheetLargestUndimmedDetentIndex: "none",
            headerShown: false,
          }}
        />
      </Stack>
      <PortalHost />
    </Provider>
  );
};

export default RootLayout;
