import { useState } from "react";
import { APP_THEME } from "@/lib/theme";

type ThemeMode = "light" | "dark";

export const useColorTheme = () => {
  const [selectedTheme, setTheme] = useState<ThemeMode>("light");

  const colors = APP_THEME[selectedTheme];

  return {
    colors,
    selectedTheme,
    setTheme,
  };
};
