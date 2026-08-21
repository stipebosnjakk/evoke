import { JSX } from "react";
import {
  View,
  Text,
  StyleSheet,
  type ViewStyle,
  type StyleProp,
  Pressable,
  GestureResponderEvent,
  useWindowDimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { SymbolView } from "expo-symbols";
import Toast from "react-native-toast-message";

type ToastRenderProps = {
  text1?: string;
  text2?: string;
  props: Record<string, any>;
};

type ToastCardProps = {
  text1?: string;
  text2?: string;
  icon: string;
  tint: string;
  containerStyle?: StyleProp<ViewStyle>;
};

// TODO: center text with no icons, and too long text is overflowing instead of wrap

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
              name={icon as any}
              size={18}
              type="monochrome"
              tintColor={tint}
            />
          </View>
          <View style={styles.toastTextContainer}>
            {text1 && (
              <Text numberOfLines={1} style={styles.toastTitleText}>
                {text1}
              </Text>
            )}
            {text2 && (
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

type TaskInfoToastCardProps = {
  text1?: string;
  text2?: string;
  buttonText?: string;
  onPress?: () => void;
  icon?: string;
  showCloseButton?: boolean;
  onIconPress?: () => void;
};

const TaskInfoToastCard = ({
  text1,
  text2,
  onPress,
  icon,
  showCloseButton = false,
  onIconPress,
}: TaskInfoToastCardProps) => {
  const { width: screenWidth } = useWindowDimensions();

  const handleClose = (event: GestureResponderEvent) => {
    event.stopPropagation();
    Toast.hide();
  };

  return (
    <Pressable
      style={[styles.toastInfoContainer, { maxWidth: screenWidth * 0.95 }]}
      onPress={onPress}
    >
      <View style={styles.toastInfoTextContainer}>
        {!!text2 && (
          <Text
            style={styles.toastMetadataText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {text2}
          </Text>
        )}
        {!!text1 && (
          <Text
            style={styles.toastTitleText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {text1}
          </Text>
        )}
      </View>
      <View style={styles.toastInfoAction}>
        {showCloseButton ? (
          <Pressable onPress={handleClose} hitSlop={10}>
            <SymbolView
              name="xmark"
              size={14}
              type="monochrome"
              tintColor="#111827"
            />
          </Pressable>
        ) : icon ? (
          <Pressable onPress={onIconPress ?? onPress} hitSlop={10}>
            <SymbolView
              name={icon as any}
              size={14}
              type="monochrome"
              tintColor="#111827"
            />
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
};

export type ToastType = "error" | "info";

export type ToastConfig = Record<
  ToastType,
  (p: ToastRenderProps) => JSX.Element
>;

export const toastConfig: ToastConfig = {
  error: ({ text1, text2 }) => (
    <ToastCard
      text1={text1}
      text2={text2}
      icon="exclamationmark.triangle.fill"
      tint="#DC2626"
    />
  ),
  info: ({ text1, text2, props }) => (
    <TaskInfoToastCard
      text1={text1}
      text2={text2}
      buttonText={props.buttonText}
      onPress={props.onPress}
      icon={props.icon}
      showCloseButton={props.showCloseButton}
      onIconPress={props.onIconPress}
    />
  ),
};
const styles = StyleSheet.create({
  toastInfoContainer: {
    minWidth: 200,
    alignSelf: "center",
    maxWidth: "95%",
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#efefef",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 2,
  },
  toastInfoTextContainer: {
    flexShrink: 1,
    minWidth: 0,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  toastInfoAction: {
    flexShrink: 0,
    marginLeft: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  toastMetadataText: {
    flexShrink: 1,
    maxWidth: "100%",
    fontSize: 12,
    color: "#70747d",
  },
  toastTitleText: {
    flexShrink: 1,
    maxWidth: "100%",
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  toastOuterContainer: {
    width: "100%",
    paddingHorizontal: 14,
  },
  toastBlurContainer: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#efefef",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 2,
  },
  toastInnerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#fafafb",
  },
  toastIconContainer: {
    width: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  toastTextContainer: {
    flex: 1,
  },
  toastSubtitleText: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
    color: "#70747d",
  },
});
