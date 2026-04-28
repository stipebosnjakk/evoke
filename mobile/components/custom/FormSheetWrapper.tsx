import { StyleProp, ViewStyle, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

import ScreenContainer from "./ScreenContainer";
import { toastConfig } from "@/components/ui/ToastConfig";

type FormSheetWrapperProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

const FormSheetWrapper = ({ children, style }: FormSheetWrapperProps) => {
  return (
    <ScreenContainer style={[styles.container, style]}>
      {children}
      <Toast
        position="bottom"
        bottomOffset={12}
        keyboardOffset={0}
        avoidKeyboard={false}
        config={toastConfig}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    paddingTop: 20,
  },
});

export default FormSheetWrapper;
