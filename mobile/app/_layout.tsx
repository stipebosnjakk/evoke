import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";

import "@/global.css";

export const unstable_settings = {
  initialRouteName: '(tabs)/today',
};

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <PortalHost />
    </>
  );
}
