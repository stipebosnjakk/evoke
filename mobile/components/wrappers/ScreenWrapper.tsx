import { StyleSheet, View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { useColorTheme } from "@/hooks/useColorTheme";

type ScreenWrapperProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const ScreenWrapper = ({ children, style }: ScreenWrapperProps) => {
  const { colors } = useColorTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }, style]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

export default ScreenWrapper;
