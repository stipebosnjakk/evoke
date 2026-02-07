import { View } from "react-native";
import type { StyleProp, ViewStyle } from "react-native";

import { useColorTheme } from "@/hooks/useColorTheme";

type ScreenContainerProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const ScreenContainer = ({ children, style }: ScreenContainerProps) => {
  const { colors } = useColorTheme();
  return (
    <View
      style={[
        {
          flex: 1,
          backgroundColor: colors.background,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export default ScreenContainer;
