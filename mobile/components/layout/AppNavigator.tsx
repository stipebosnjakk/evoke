import { useEffect } from "react";
import { ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

import { toastConfig } from "@/components/ui/ToastConfig";
import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import { createSheetRoutes, routes } from "@/constants/routes";
import { useLoadInitialTasks } from "@/hooks/useLoadInitialTasks";
import { useLoadUserConfig } from "@/hooks/useLoadUserConfig";
import { useAppSelector } from "@/hooks/storeHooks";

const createSheetOptions = {
  presentation: "formSheet",
  sheetAllowedDetents: "fitToContents",
  sheetInitialDetentIndex: 0,
  sheetGrabberVisible: true,
  contentStyle: { backgroundColor: "white" },
} as const;

const AppNavigator = () => {
  useLoadUserConfig();
  useLoadInitialTasks();

  const userStatus = useAppSelector((state) => state.user.status);
  const userError = useAppSelector((state) => state.user.error);
  const tasksStatus = useAppSelector((state) => state.tasks.status);
  const tasksError = useAppSelector((state) => state.tasks.error);

  const loading =
    userStatus === "idle" || userStatus === "loading" || tasksStatus === "idle";

  useEffect(() => {
    if (userError) {
      Toast.show({
        type: "error",
        text1: "Failed to get user information",
        text2: userError,
      });
    }

    if (tasksError) {
      Toast.show({
        type: "error",
        text1: "Failed to get tasks",
        text2: tasksError,
      });
    }
  }, [userError, tasksError]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {loading ? (
        <ScreenWrapper
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
        </ScreenWrapper>
      ) : (
        <>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name={routes.task_single_group.route}
              options={{
                presentation: "modal",
                contentStyle: { backgroundColor: "white" },
              }}
            />
            {createSheetRoutes.map((item) => (
              <Stack.Screen
                key={item.route}
                name={item.route}
                options={createSheetOptions}
              />
            ))}
          </Stack>
          <PortalHost />
        </>
      )}
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );
};

export default AppNavigator;
