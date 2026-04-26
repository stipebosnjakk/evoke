import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { Provider } from "react-redux";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";

import "@/global.css";
import { toastConfig } from "@/components/ui/ToastConfig";
import { store } from "@/store/store";
import { db } from "@/db/client";
import migrations from "@/drizzle/migrations";
import ScreenContainer from "@/components/custom/ScreenContainer";
import GlobalToastListener from "@/components/custom/GlobalToastListener";

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

  const modalOptions: NativeStackNavigationOptions = {
    presentation: "formSheet",
    sheetAllowedDetents: "fitToContents",
    sheetInitialDetentIndex: 0,
    sheetGrabberVisible: true,
    contentStyle: { backgroundColor: "white" },
  };

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GlobalToastListener />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="(modals)/create/task/create"
            options={modalOptions}
          />
          <Stack.Screen
            name="(modals)/create/task/date"
            options={modalOptions}
          />
          <Stack.Screen
            name="(modals)/create/task/deadline"
            options={modalOptions}
          />
          <Stack.Screen
            name="(modals)/create/task/time"
            options={modalOptions}
          />
          <Stack.Screen
            name="(modals)/create/task/repeat"
            options={modalOptions}
          />
          <Stack.Screen
            name="(modals)/create/task/status"
            options={modalOptions}
          />
        </Stack>
      </GestureHandlerRootView>
      <Toast config={toastConfig} />
      <PortalHost />
    </Provider>
  );
};

export default RootLayout;
