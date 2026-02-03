import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";

import "@/global.css";

export const unstable_settings = {
  initialRouteName: "(tabs)/today",
};

export default function RootLayout() {
  return (
    <>
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
    </>
  );
}
