import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { Provider } from "react-redux";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import "@/global.css";
import { toastConfig } from "@/components/ui/ToastConfig";
import { store } from "@/store/store";
import { db } from "@/db/client";
import migrations from "@/drizzle/migrations";
import ScreenContainer from "@/components/custom/ScreenContainer";
import { createSheetRoutes } from "@/constants/routes";

const createSheetOptions = {
  presentation: "formSheet",
  sheetAllowedDetents: "fitToContents",
  sheetInitialDetentIndex: 0,
  sheetGrabberVisible: true,
  contentStyle: { backgroundColor: "white" },
} as const;

const RootLayout = () => {
  const { success, error: migrationError } = useMigrations(db, migrations);

  useEffect(() => {
    if (!migrationError) return;
    Toast.show({
      type: "error",
      text1: "Database error",
      text2: migrationError.message || "Try reinstalling the app",
    });
  }, [migrationError]);

  if (!success) {
    return (
      <ScreenContainer
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator />
        <Toast config={toastConfig} />
      </ScreenContainer>
    );
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          {createSheetRoutes.map((item) => (
            <Stack.Screen
              key={item.route}
              name={item.route}
              options={createSheetOptions}
            />
          ))}
        </Stack>
      </GestureHandlerRootView>
      <Toast config={toastConfig} />
      <PortalHost />
    </Provider>
  );
};

export default RootLayout;
