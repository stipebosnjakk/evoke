import { View } from "react-native";
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
      style={[
        {
          flex: 1,
          backgroundColor: colors.background,
          padding: 16,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default ScreenWrapper;
