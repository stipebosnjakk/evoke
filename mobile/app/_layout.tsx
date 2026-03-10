import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { Provider } from "react-redux";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "@/global.css";
import { toastConfig } from "@/components/ui/ToastConfig";
import { store } from "@/store/store";
import migrations from "@/drizzle/migrations";
import { db } from "@/db/client";
import ScreenContainer from "@/components/custom/ScreenContainer";

const RootLayout = () => {
  const { success, error } = useMigrations(db, migrations);

  useEffect(() => {
    if (!error) return;
    Toast.show({
      type: "error",
      text1: "Database error",
      text2: error.message || "Try reinstalling the app",
    });
  }, [error]);

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

  const modalOptions = {
    presentation: "formSheet" as const,
    sheetAllowedDetents: "fitToContents",
    sheetInitialDetentIndex: 0,
    sheetGrabberVisible: true,
    contentStyle: { backgroundColor: "white" },
  } as const;

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
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
            name="(modals)/create/task/repeat"
            options={modalOptions}
          />
        </Stack>
        <Toast config={toastConfig} />
        <PortalHost />
      </GestureHandlerRootView>
    </Provider>
  );
};

export default RootLayout;
