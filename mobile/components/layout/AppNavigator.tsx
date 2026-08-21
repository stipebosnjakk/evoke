import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import { toastConfig } from "@/components/custom/ToastConfig";
import { formSheetRoutes, routes } from "@/constants/routes";
import { useLoadInitialData } from "@/hooks/useLoadInitialData";
import { useLoadUserConfig } from "@/hooks/useLoadUserConfig";
import { useAppSelector } from "@/hooks/storeHooks";

const formSheetOptions = {
  presentation: "formSheet",
  sheetAllowedDetents: "fitToContents",
  sheetInitialDetentIndex: 0,
  sheetGrabberVisible: true,
  contentStyle: { backgroundColor: "white" },
} as const;

const AppNavigator = () => {
  const { top } = useSafeAreaInsets();

  useLoadUserConfig();
  useLoadInitialData();

  const userStatus = useAppSelector((state) => state.user.status);
  const userError = useAppSelector((state) => state.user.error);
  const tasksStatus = useAppSelector((state) => state.tasks.status);
  const tasksError = useAppSelector((state) => state.tasks.error);
  const projectsStatus = useAppSelector((state) => state.projects.status);
  const projectsError = useAppSelector((state) => state.projects.error);

  const loading =
    userStatus === "idle" ||
    userStatus === "loading" ||
    tasksStatus === "idle" ||
    tasksStatus === "loading" ||
    projectsStatus === "idle" ||
    projectsStatus === "loading";

  const [hasFinishedInitialLoad, setHasFinishedInitialLoad] = useState(false);

  useEffect(() => {
    if (!loading) {
      setHasFinishedInitialLoad(true);
    }
  }, [loading]);

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

    if (projectsError) {
      Toast.show({
        type: "error",
        text1: "Failed to get projects",
        text2: projectsError,
      });
    }
  }, [userError, tasksError, projectsError]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {!hasFinishedInitialLoad ? (
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
              name={routes.single_project.route}
              options={{
                presentation: "card",
                contentStyle: { backgroundColor: "white" },
              }}
            />
            <Stack.Screen
              name={routes.single_group.route}
              options={{
                presentation: "modal",
                contentStyle: { backgroundColor: "white" },
              }}
            />
            <Stack.Screen
              name={routes.add_tasks_to_project.route}
              options={{
                presentation: "modal",
                contentStyle: { backgroundColor: "white" },
              }}
            />
            <Stack.Screen
              name={routes.form_task_project.route}
              options={{
                presentation: "modal",
                contentStyle: { backgroundColor: "white" },
              }}
            />
            <Stack.Screen
              name={routes.search.route}
              options={{
                presentation: "card",
                contentStyle: { backgroundColor: "white" },
              }}
            />
            <Stack.Screen
              name={routes.single_task.route}
              options={{
                presentation: "modal",
                contentStyle: { backgroundColor: "white" },
              }}
            />
            {formSheetRoutes.map((item) => (
              <Stack.Screen
                key={item.route}
                name={item.route}
                options={formSheetOptions}
              />
            ))}
          </Stack>
          <PortalHost />
        </>
      )}
      <Toast config={toastConfig} bottomOffset={92} topOffset={top - 3} />
    </GestureHandlerRootView>
  );
};

export default AppNavigator;
