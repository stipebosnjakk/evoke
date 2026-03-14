import {
  Pressable,
  Animated,
  StyleProp,
  ViewStyle,
  StyleSheet,
  PressableProps,
} from "react-native";
import { useRef, ReactNode } from "react";

type ButtonProps = PressableProps & {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  iconOnly?: boolean;
};

const Button = ({
  children,
  style,
  iconOnly = false,
  ...props
}: ButtonProps) => {
  const value = useRef(new Animated.Value(0)).current;
  const isAnimated = () => {
    Animated.timing(value, {
      toValue: 1,
      duration: 90,
      useNativeDriver: true,
    }).start();
  };
  const outAnimated = () => {
    Animated.timing(value, {
      toValue: 0,
      duration: 140,
      useNativeDriver: true,
    }).start();
  };
  return (
    <Pressable
      {...props}
      onPressIn={isAnimated}
      onPressOut={outAnimated}
      hitSlop={10}
      style={[style, iconOnly ? styles.iconOnly : { borderRadius: 10 }]}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.pressedOverlay, { opacity: value }]}
      />
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  iconOnly: {
    width: 36,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  pressedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#e5e7eb",
  },
});

export default Button;
