import {
  Platform,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";

type ButtonType = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
};

const Button = ({ children, style, onPress }: ButtonType) => {
  const glass = Platform.OS === "ios" && isGlassEffectAPIAvailable();

  if (!glass) {
    return (
      <TouchableOpacity style={style} onPress={onPress}>
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <GlassView
      style={[styles.liquid, style]}
      glassEffectStyle="clear"
      isInteractive
    >
      <TouchableOpacity style={[style, styles.pressable]} onPress={onPress}>
        {children}
      </TouchableOpacity>
    </GlassView>
  );
};

const styles = StyleSheet.create({
  liquid: {
    height: 58,
    borderRadius: 29,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  pressable: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Button;
