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

  return (
    <Provider store={store}>
      <GestureHandlerRootView>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="create-task"
            options={{
              presentation: "formSheet",
              sheetAllowedDetents: "fitToContents",
              sheetGrabberVisible: true,
              sheetCornerRadius: 16,
              sheetLargestUndimmedDetentIndex: "none",
              headerShown: false,
              contentStyle: { backgroundColor: "white" },
            }}
          />
        </Stack>
        <PortalHost />
        <Toast config={toastConfig} />
      </GestureHandlerRootView>
    </Provider>
  );
};

export default RootLayout;
