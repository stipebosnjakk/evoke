import { useColorTheme } from "@/hooks/useColorTheme";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenContainerProps = {
  children: React.ReactNode;
};

const ScreenContainer = ({ children }: ScreenContainerProps) => {
  const { colors } = useColorTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {children}
    </SafeAreaView>
  );
};

export default ScreenContainer;
