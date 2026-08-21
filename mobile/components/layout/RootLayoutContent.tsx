import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import Toast from "react-native-toast-message";

import { toastConfig } from "@/components/custom/ToastConfig";
import { db } from "@/db/client";
import migrations from "@/drizzle/migrations";
import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import AppNavigator from "@/components/layout/AppNavigator";

const RootLayoutContent = () => {
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
      <ScreenWrapper style={{ justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
        <Toast config={toastConfig} />
      </ScreenWrapper>
    );
  }

  return <AppNavigator />;
};

export default RootLayoutContent;
