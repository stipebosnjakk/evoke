import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { SymbolView } from "expo-symbols";
import Toast from "react-native-toast-message";

import { TaskStateData } from "@/types/task.types";
import { useAppDispatch } from "@/hooks/storeHooks";
import {
  completeTaskAction,
  restoreCompletedRepeatTaskAction,
  restoreCompletedTaskAction,
} from "@/store/thunks/mutation.thunks";
import { RepeatTaskCompletionAction } from "@/store/thunks/create.thunks";
import { toIsoDate } from "@/utils/date";

type CompleteTaskType = {
  task: TaskStateData;
  isPreview?: boolean;
};

const CompleteTask = ({ task, isPreview }: CompleteTaskType) => {
  const dispatch = useAppDispatch();

  const [isCompleting, setIsCompleting] = useState<boolean>(false);

  const completed =
    task.is_completed || task.repeat_today_status === "completed_today";

  const isCompletedOrCompleting = completed || isCompleting;

  const completionProgress = useRef(
    new Animated.Value(completed ? 1 : 0),
  ).current;

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
      if (finished) {
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
          task.repeat &&
          task.repeat.length > 0 &&
          task.repeat_today_status === "not_completed_today"
        ) {
          dispatch(
            RepeatTaskCompletionAction({
              taskId: task.id,
              completionDate: toIsoDate(new Date()),
            }),
          );
        } else {
          dispatch(completeTaskAction({ taskId: task.id }));
        }
        setIsCompleting(false);
      }
    });
  };

  const handleRestoreCompletedTask = () => {
    Toast.hide();
    if (task.repeat && task.repeat.length > 0) {
      dispatch(
        restoreCompletedRepeatTaskAction({
          taskId: task.id,
          completionDate: toIsoDate(new Date()),
        }),
      );
      return;
    }
    dispatch(restoreCompletedTaskAction({ taskId: task.id }));
  };

  return (
    <View style={styles.topTaskSide}>
      {isPreview ? (
        <SymbolView name="clock" size={15} tintColor="#A0A09A" />
      ) : (
        <Pressable
          onPress={handleComplete}
          disabled={isCompletedOrCompleting}
          style={styles.completionCircle}
        >
          <Animated.View
            pointerEvents="none"
            style={[
              styles.completionCircleFill,
              {
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
              size={10}
              weight="bold"
              tintColor="#FFFFFF"
            />
          </Animated.View>
        </Pressable>
      )}
      <Text
        style={[
          styles.taskTitle,
          isCompletedOrCompleting && styles.taskTitleCompleted,
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {task.title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  topTaskSide: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  completionCircle: {
    flexShrink: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.2,
    borderColor: "#E6E2DC",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  completionCircleFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#2F2F2D",
    borderRadius: 9,
  },
  completionCheck: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  taskTitle: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
    color: "#1F1F1D",
  },
  taskTitleCompleted: {
    color: "#8C8C87",
    textDecorationLine: "line-through",
    textDecorationColor: "#8C8C87",
  },
});
export default CompleteTask;
