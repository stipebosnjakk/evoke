import { StyleProp, ViewStyle, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

import ScreenWrapper from "./ScreenWrapper";
import { toastConfig } from "@/components/ui/ToastConfig";

type SheetWrapperProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  toastEnabled?: boolean;
};

const SheetWrapper = ({
  children,
  style,
  toastEnabled = true,
}: SheetWrapperProps) => {
  return (
    <ScreenWrapper style={[styles.container, style]}>
      {children}
      {toastEnabled ? (
        <Toast
          position="bottom"
          bottomOffset={12}
          keyboardOffset={0}
          avoidKeyboard={false}
          config={toastConfig}
        />
      ) : null}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    paddingTop: 20,
  },
});

export default SheetWrapper;
