import { JSX } from "react";
import {
  View,
  Text,
  StyleSheet,
  type ViewStyle,
  type StyleProp,
} from "react-native";
import { BlurView } from "expo-blur";
import { SymbolView } from "expo-symbols";

type ToastRenderProps = {
  text1?: string;
  text2?: string;
  props?: Record<string, any>;
};
type ToastCardProps = {
  text1?: string;
  text2?: string;
  icon: Parameters<typeof SymbolView>[0]["name"];
  tint: string;
  containerStyle?: StyleProp<ViewStyle>;
};

const ToastCard = ({
  text1,
  text2,
  icon,
  tint,
  containerStyle,
}: ToastCardProps) => {
  return (
    <View style={[styles.toastOuterContainer, containerStyle]}>
      <BlurView intensity={22} tint="light" style={styles.toastBlurContainer}>
        <View style={styles.toastInnerRow}>
          <View style={styles.toastIconContainer}>
            <SymbolView
              name={icon}
              size={18}
              type="monochrome"
              tintColor={tint}
            />
          </View>
          <View style={styles.toastTextContainer}>
            {!!text1 && (
              <Text numberOfLines={1} style={styles.toastTitleText}>
                {text1}
              </Text>
            )}
            {!!text2 && (
              <Text numberOfLines={2} style={styles.toastSubtitleText}>
                {text2}
              </Text>
            )}
          </View>
        </View>
      </BlurView>
    </View>
  );
};

export type EvokeToastType = "success" | "error" | "info";
export type EvokeToastConfig = Record<
  EvokeToastType,
  (p: ToastRenderProps) => JSX.Element
>;

export const toastConfig: EvokeToastConfig = {
  success: ({ text1, text2 }) => (
    <ToastCard
      text1={text1}
      text2={text2}
      icon="checkmark.circle.fill"
      tint="#16A34A"
    />
  ),
  error: ({ text1, text2 }) => (
    <ToastCard
      text1={text1}
      text2={text2}
      icon="exclamationmark.triangle.fill"
      tint="#DC2626"
    />
  ),
  info: ({ text1, text2 }) => (
    <ToastCard
      text1={text1}
      text2={text2}
      icon="info.circle.fill"
      tint="#2563EB"
    />
  ),
};

const styles = StyleSheet.create({
  toastOuterContainer: { width: "100%", paddingHorizontal: 14 },
  toastBlurContainer: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  toastInnerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "rgba(246,246,248,0.55)",
  },
  toastIconContainer: {
    width: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  toastTextContainer: { flex: 1 },
  toastTitleText: { fontSize: 14, fontWeight: "700", color: "#111827" },
  toastSubtitleText: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(17,24,39,0.60)",
  },
});
