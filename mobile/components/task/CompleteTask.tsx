import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { SymbolView } from "expo-symbols";
import Toast from "react-native-toast-message";

import { TaskStateData } from "@/types/task.types";
import { useAppDispatch } from "@/hooks/storeHooks";
import {
  completeTaskAction,
  restoreCompletedTaskAction,
} from "@/store/thunks/update.thunks";

type CompleteTaskType = {
  task: TaskStateData;
};

const CompleteTask = ({ task }: CompleteTaskType) => {
  const dispatch = useAppDispatch();

  const [isCompleting, setIsCompleting] = useState<boolean>(false);

  const isVisuallyCompleted = task.is_completed || isCompleting;

  const completionProgress = useRef(
    new Animated.Value(task.is_completed ? 1 : 0),
  ).current;

  useEffect(() => {
    completionProgress.setValue(task.is_completed ? 1 : 0);
  }, [task.is_completed, completionProgress]);

  const handleComplete = () => {
    if (task.is_completed || task.is_deleted || isCompleting) return;

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
            icon: "xmark",
            onPress: handleRestoreCompletedTask,
          },
        });

        dispatch(completeTaskAction({ taskId: task.id }));
        setIsCompleting(false);
      }
    });
  };

  const handleRestoreCompletedTask = () => {
    Toast.hide();
    dispatch(restoreCompletedTaskAction({ taskId: task.id }));
  };

  return (
    <View style={styles.topTaskSide}>
      <Pressable
        onPress={handleComplete}
        disabled={isVisuallyCompleted || task.is_deleted}
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
      <Text
        style={[
          styles.taskTitle,
          isVisuallyCompleted && styles.taskTitleCompleted,
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
