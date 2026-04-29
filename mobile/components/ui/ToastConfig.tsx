import { JSX } from "react";
import {
  View,
  Text,
  StyleSheet,
  type ViewStyle,
  type StyleProp,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import { SymbolView } from "expo-symbols";
import { useRouter, type Href } from "expo-router";

type ToastRenderProps = {
  text1?: string;
  text2?: string;
  props?: Record<string, any>;
};

type ToastCardProps = {
  text1?: string;
  text2?: string;
  icon: string;
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

type TaskCreatedToastCardProps = {
  text1?: string;
  text2?: string;
  href: Href;
};

const TaskSavedToastCard = ({
  text1,
  text2 = "Task saved",
  href,
}: TaskCreatedToastCardProps) => {
  const router = useRouter();
  return (
    <Pressable
      style={styles.taskSavedContainer}
      onPress={() => {
        if (href) router.dismissTo(href);
      }}
    >
      <View>
        <Text style={styles.toastMetadataText} numberOfLines={1}>
          {text2}
        </Text>
        <Text style={styles.toastTitleText} numberOfLines={1}>
          {text1}
        </Text>
      </View>
      <SymbolView
        name="chevron.right"
        size={14}
        type="monochrome"
        tintColor="#111827"
      />
    </Pressable>
  );
};

export type ToastType = "success" | "error" | "info" | "taskSaved";

export type ToastConfig = Record<
  ToastType,
  (p: ToastRenderProps) => JSX.Element
>;

export const toastConfig: ToastConfig = {
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
  taskSaved: ({ text1, text2, props }) => (
    <TaskSavedToastCard text1={text1} text2={text2} href={props?.href} />
  ),
};
const styles = StyleSheet.create({
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
  toastTitleText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  toastSubtitleText: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
    color: "#70747d",
  },
  taskSavedWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  taskSavedContainer: {
    minWidth: 200,
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
  toastMetadataText: {
    fontSize: 12,
    color: "#70747d",
  },
  routeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    backgroundColor: "#efefef",
  },
  routeButtonText: {
    fontSize: 10,
    fontWeight: "700",
  },
});
