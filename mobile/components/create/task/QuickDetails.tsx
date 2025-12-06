import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Keyboard, Animated, Pressable } from "react-native";
import { SymbolView } from "expo-symbols/build/SymbolView";
import { useColorTheme } from "@/hooks/useColorTheme";
const ICON_SIZE = 22;
const QuickDetails = () => {
  const { colors } = useColorTheme();
  const bottomAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardWillShow", (e) => {
      Animated.timing(bottomAnim, {
        toValue: e.endCoordinates.height,
        duration: 180,
        useNativeDriver: false,
      }).start();
    });
    const hideSub = Keyboard.addListener("keyboardWillHide", () => {
      Animated.timing(bottomAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: false,
      }).start();
    });
    const showSubDid = Keyboard.addListener("keyboardDidShow", (e) => {
      Animated.timing(bottomAnim, {
        toValue: e.endCoordinates.height,
        duration: 0,
        useNativeDriver: false,
      }).start();
    });
    const hideSubDid = Keyboard.addListener("keyboardDidHide", () => {
      Animated.timing(bottomAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      }).start();
    });
    return () => {
      showSub.remove();
      hideSub.remove();
      showSubDid.remove();
      hideSubDid.remove();
    };
  }, [bottomAnim]);
  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.nav,
          borderTopColor: colors.border,
          bottom: bottomAnim,
        },
      ]}
    >
      <View style={styles.row}>
        <Pressable style={styles.iconButton}>
          <SymbolView
            name="flag.fill"
            size={ICON_SIZE}
            tintColor={colors.secondary}
          />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <SymbolView
            name="calendar"
            size={ICON_SIZE}
            tintColor={colors.secondary}
          />
        </Pressable>
        <Pressable style={styles.iconButton}>
          <SymbolView
            name="timer"
            size={ICON_SIZE}
            tintColor={colors.secondary}
          />
        </Pressable>
      </View>
    </Animated.View>
  );
};
const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 40,
    justifyContent: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
  },
  row: { flexDirection: "row", alignItems: "center" },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
});
export default QuickDetails;
