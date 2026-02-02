import {
  Pressable,
  Animated,
  StyleProp,
  ViewStyle,
  StyleSheet,
} from "react-native";
import { useRef, ReactNode } from "react";

type IconButtonProps = {
  onPress: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const IconButton = ({ onPress, children, style }: IconButtonProps) => {
  const v = useRef(new Animated.Value(0)).current;
  const inAnim = () => {
    Animated.timing(v, {
      toValue: 1,
      duration: 90,
      useNativeDriver: true,
    }).start();
  };
  const outAnim = () => {
    Animated.timing(v, {
      toValue: 0,
      duration: 140,
      useNativeDriver: true,
    }).start();
  };
  return (
    <Pressable
      onPress={onPress}
      onPressIn={inAnim}
      onPressOut={outAnim}
      hitSlop={10}
      style={[styles.iconBtn, style]}
    >
      <Animated.View
        pointerEvents="none"
        style={[styles.pressedOverlay, { opacity: v }]}
      />
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    overflow: "hidden",
  },
  pressedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#e5e7eb",
  },
});

export default IconButton;
