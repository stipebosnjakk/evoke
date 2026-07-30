import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { TaskStateData } from "@/types/task.types";
import { useAppDispatch } from "@/hooks/storeHooks";
import { toIsoDate } from "@/utils/date";
import {
  completeTaskAction,
  repeatTaskCompletionAction,
  restoreCompletedRepeatTaskAction,
  restoreCompletedTaskAction,
} from "@/store/thunks/task/task.completion.thunks";
import { COMPLETE_TASK_VARIANTS } from "@/constants/style";
import { routes } from "@/constants/routes";

type CompleteTaskProps = {
  task: TaskStateData;
  isPreview?: boolean;
  variant?: "detail" | "list";
};

const CompleteTask = ({
  task,
  isPreview = false,
  variant = "list",
}: CompleteTaskProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [isCompleting, setIsCompleting] = useState(false);

  const { size, fontSize } = COMPLETE_TASK_VARIANTS[variant];

  const isRepeatTask = Boolean(task.repeat?.length);

  const isCompleted =
    task.is_completed || task.repeat_today_status === "completed_today";

  const isDisabled = isCompleted || isCompleting;

  const progress = useRef(new Animated.Value(isCompleted ? 1 : 0)).current;

  useEffect(() => {
    progress.setValue(isCompleted ? 1 : 0);
  }, [isCompleted, progress]);

  const navigateToEditInputs = () => {
    if (variant === "detail") {
      router.push({
        pathname: routes.form_task_inputs.href,
        params: {
          taskId: task.id,
          editInput: "title",
        },
      });
    }
  };

  const handleRestoreTask = () => {
    Toast.hide();

    if (isRepeatTask) {
      dispatch(
        restoreCompletedRepeatTaskAction({
          taskId: task.id,
          completionDate: toIsoDate(new Date()),
        }),
      );

      return;
    }

    dispatch(
      restoreCompletedTaskAction({
        taskId: task.id,
      }),
    );
  };

  const showUndoToast = () => {
    Toast.show({
      position: "top",
      type: "info",
      text1: "Undo",
      text2: "Completed",
      props: {
        showCloseButton: true,
        onPress: handleRestoreTask,
      },
    });
  };

  const handleSaveCompletion = () => {
    const shouldCompleteRepeatTask =
      isRepeatTask && task.repeat_today_status === "not_completed_today";

    if (shouldCompleteRepeatTask) {
      dispatch(
        repeatTaskCompletionAction({
          taskId: task.id,
          completionDate: toIsoDate(new Date()),
        }),
      );

      return;
    }

    dispatch(
      completeTaskAction({
        taskId: task.id,
      }),
    );
  };

  const handleCompleteTask = () => {
    if (isDisabled) return;

    setIsCompleting(true);

    Animated.sequence([
      Animated.timing(progress, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(700),
    ]).start(({ finished }) => {
      setIsCompleting(false);

      if (!finished) return;

      showUndoToast();
      handleSaveCompletion();
    });
  };

  const scale = size / COMPLETE_TASK_VARIANTS.list.size;
  const lineHeight = Math.ceil(fontSize * 1.3);

  const topOffset =
    variant === "detail" ? Math.max(0, (lineHeight - size) / 2) : 0;

  const contentGap = Math.max(8, Math.round(12 * scale));
  const previewIconSize = Math.max(12, Math.round(size * 0.83));
  const checkmarkSize = Math.max(8, Math.round(10 * scale));
  const borderWidth = Math.max(1, 1.2 * scale);
  const circleRadius = size / 2;

  const completionColor = task.project?.color ?? "#2F2F2D";
  const idleBorderColor = task.project?.color ?? "#E6E2DC";

  const outlineOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const circleStyle = {
    width: size,
    height: size,
    borderRadius: circleRadius,
    marginTop: topOffset,
  };

  const titleContent = (
    <Text
      style={[
        styles.title,
        {
          fontSize,
          lineHeight,
        },
        isDisabled && styles.completedTitle,
      ]}
      numberOfLines={variant === "detail" ? undefined : 1}
      ellipsizeMode={variant === "detail" ? undefined : "tail"}
    >
      {task.title}
    </Text>
  );

  return (
    <View
      style={[
        styles.container,
        {
          gap: contentGap,
          alignItems: variant === "detail" ? "flex-start" : "center",
        },
      ]}
    >
      {isPreview ? (
        <SymbolView
          name="clock"
          size={previewIconSize}
          tintColor={task.project?.color ?? "#A0A09A"}
          style={{ marginTop: topOffset }}
        />
      ) : (
        <Pressable
          onPress={handleCompleteTask}
          disabled={isDisabled}
          hitSlop={8}
          style={[styles.circle, circleStyle]}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.circleOutline,
              {
                borderRadius: circleRadius,
                borderWidth,
                borderColor: idleBorderColor,
                opacity: outlineOpacity,
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.circleFill,
              {
                borderRadius: circleRadius,
                backgroundColor: completionColor,
                opacity: progress,
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.checkmarkContainer,
              {
                opacity: progress,
              },
            ]}
          >
            <SymbolView
              name="checkmark"
              size={checkmarkSize}
              weight="bold"
              tintColor="#FFFFFF"
            />
          </Animated.View>
        </Pressable>
      )}
      {variant === "detail" ? (
        <Pressable onPress={navigateToEditInputs} style={styles.titleContainer}>
          {titleContent}
        </Pressable>
      ) : (
        <View pointerEvents="none" style={styles.titleContainer}>
          {titleContent}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minWidth: 0,
    flexDirection: "row",
  },
  circle: {
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  circleOutline: {
    ...StyleSheet.absoluteFillObject,
  },
  circleFill: {
    ...StyleSheet.absoluteFillObject,
  },
  checkmarkContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontWeight: "600",
    color: "#1F1F1D",
  },
  completedTitle: {
    color: "#8C8C87",
    textDecorationLine: "line-through",
    textDecorationColor: "#8C8C87",
  },
});

export default CompleteTask;
