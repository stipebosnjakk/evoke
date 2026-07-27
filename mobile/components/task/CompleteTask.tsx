import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated, Pressable } from "react-native";
import { SymbolView } from "expo-symbols";
import Toast from "react-native-toast-message";

import { TaskStateData } from "@/types/task.types";
import { useAppDispatch } from "@/hooks/storeHooks";
import {
  completeTaskAction,
  restoreCompletedRepeatTaskAction,
  restoreCompletedTaskAction,
  repeatTaskCompletionAction,
} from "@/store/thunks/task/task.completion.thunks";
import { toIsoDate } from "@/utils/date";
import TaskTitle from "@/components/task/TaskTitle";

type CompleteTaskType = {
  task: TaskStateData;
  isPreview?: boolean;
  size?: number;
  fontSize?: number;
  multiline?: boolean;
  color?: string;
};

const DEFAULT_CIRCLE_SIZE = 18;
const DEFAULT_FONT_SIZE = 16;

const CompleteTask = ({
  task,
  isPreview,
  size = DEFAULT_CIRCLE_SIZE,
  fontSize = DEFAULT_FONT_SIZE,
  multiline = false,
  color,
}: CompleteTaskType) => {
  const dispatch = useAppDispatch();

  const [isCompleting, setIsCompleting] = useState(false);

  const completed =
    task.is_completed || task.repeat_today_status === "completed_today";

  const isCompletedOrCompleting = completed || isCompleting;

  const completionProgress = useRef(
    new Animated.Value(completed ? 1 : 0),
  ).current;

  const scale = size / DEFAULT_CIRCLE_SIZE;

  const circleRadius = size / 2;
  const checkmarkSize = Math.max(8, Math.round(10 * scale));
  const borderWidth = Math.max(1, 1.2 * scale);
  const contentGap = Math.max(8, Math.round(12 * scale));
  const lineHeight = Math.round(fontSize * 1.3);
  const circleTopOffset = Math.max(0, (lineHeight - size) / 2);
  const previewIconSize = Math.max(12, Math.round(size * 0.83));

  useEffect(() => {
    completionProgress.setValue(completed ? 1 : 0);
  }, [completed, completionProgress]);

  const handleComplete = () => {
    if (isCompletedOrCompleting) return;

    setIsCompleting(true);

    Animated.sequence([
      Animated.timing(completionProgress, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(700),
    ]).start(({ finished }) => {
      if (!finished) {
        setIsCompleting(false);
        return;
      }

      Toast.show({
        position: "top",
        type: "info",
        text1: "Undo",
        text2: "Completed",
        props: {
          showCloseButton: true,
          onPress: handleRestoreCompletedTask,
        },
      });

      if (
        task.repeat?.length &&
        task.repeat_today_status === "not_completed_today"
      ) {
        dispatch(
          repeatTaskCompletionAction({
            taskId: task.id,
            completionDate: toIsoDate(new Date()),
          }),
        );
      } else {
        dispatch(
          completeTaskAction({
            taskId: task.id,
          }),
        );
      }

      setIsCompleting(false);
    });
  };

  const handleRestoreCompletedTask = () => {
    Toast.hide();

    if (task.repeat?.length) {
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

  return (
    <View
      style={[
        styles.topTaskSide,
        {
          gap: contentGap,
          alignItems: multiline ? "flex-start" : "center",
        },
      ]}
    >
      {isPreview ? (
        <SymbolView
          name="clock"
          size={previewIconSize}
          tintColor={color ?? "#A0A09A"}
          style={{ marginTop: multiline ? circleTopOffset : 0 }}
        />
      ) : (
        <Pressable
          onPress={handleComplete}
          disabled={isCompletedOrCompleting}
          hitSlop={8}
          style={[
            styles.completionCircle,
            {
              width: size,
              height: size,
              borderRadius: circleRadius,
              borderWidth,
              marginTop: multiline ? circleTopOffset : 0,
              borderColor: color ?? "#E6E2DC",
            },
          ]}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.completionCircleFill,
              {
                borderRadius: circleRadius,
                opacity: completionProgress,
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.completionCheck,
              {
                opacity: completionProgress,
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
      <TaskTitle
        fontSize={fontSize}
        title={task.title!}
        lineHeight={lineHeight}
        multiline={multiline}
        isCompletedOrCompleting={isCompletedOrCompleting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  topTaskSide: {
    minWidth: 0,
    flexDirection: "row",
  },
  completionCircle: {
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  completionCircleFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#2F2F2D",
  },
  completionCheck: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CompleteTask;
