import { Stack } from "expo-router";
import { PortalHost } from "@rn-primitives/portal";

import "@/global.css";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="create-slider"
          options={{
            presentation: "card",
          }}
        />
      </Stack>
      <PortalHost />
    </>
  );
}
