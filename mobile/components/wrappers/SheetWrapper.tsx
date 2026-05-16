import { StyleProp, ViewStyle, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

import ScreenWrapper from "./ScreenWrapper";
import { toastConfig } from "@/components/ui/ToastConfig";

type SheetWrapperProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const SheetWrapper = ({ children, style }: SheetWrapperProps) => {
  return (
    <ScreenWrapper style={[styles.container, style]}>
      {children}
      <Toast
        position="bottom"
        bottomOffset={12}
        keyboardOffset={0}
        avoidKeyboard={false}
        config={toastConfig}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    padding: 0,
    paddingTop: 20,
  },
});

export default SheetWrapper;
