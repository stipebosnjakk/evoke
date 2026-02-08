import { useEffect } from "react";
import { Provider } from "react-redux";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/components/ui/ToastConfig";
import { ActivityIndicator } from "react-native";

import "@/global.css";
import { store } from "@/store/store";
import migrations from "@/drizzle/migrations";
import { db } from "@/db/client";
import ScreenContainer from "@/components/custom/ScreenContainer";

const RootLayout = () => {
  // TODO: on loading, check if migrations = success, then render DB and Redux
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
      </ScreenContainer>
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
            contentStyle: { backgroundColor: "white" },
          }}
        />
      </Stack>
      <PortalHost />
      <Toast config={toastConfig} />
    </Provider>
  );
};

export default RootLayout;
