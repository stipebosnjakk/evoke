import { Text, View } from "react-native";
import { Provider } from "react-redux";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';

import * as SQLite from "expo-sqlite";

// TODO: check if drizle folder and migrations should be inside .env file
// TODO: check this migration what to do with it 
// TODO: quick add creation inbox placement task

// TODO: push changes for .env file to gitignore

import "@/global.css";
import { store } from "@/store/store";
import migrations from "@/drizzle/migrations";
import { db } from "@/db/client";
import { useEffect } from "react";

const RootLayout = () => {
  const { success, error } = useMigrations(db, migrations);
  console.log("Migration status - success:", success, "error:", error);

  useEffect(() => {
    const deleteDb = async () => {
      await SQLite.deleteDatabaseAsync(process.env.EXPO_PUBLIC_DATABASE_NAME!);
      console.log("Database deleted");
    };

    // Uncomment the following line to delete the database on app start
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
