import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { SymbolView } from "expo-symbols";
import { useCalendars, useLocales } from "expo-localization";
import { isBefore, parseISO, startOfToday } from "date-fns";

import type { Task as TaskType } from "@/db";
import { STATUS_OPTIONS } from "@/constants/status";
import { useAppDispatch } from "@/hooks/storeHooks";
import {
  completeTaskAction,
  restoreCompletedTaskAction,
} from "@/store/thunks/update.thunks";
import {
  formatTimeFromMin,
  getDateLabel,
  getDurationFromDurationMin,
  toIsoDate,
} from "@/utils/date";
import Toast from "react-native-toast-message";

type TaskGroupType = {
  task: TaskType;
};

type MetaType = {
  id: string;
  icon: string;
  label?: string;
};

const Task = ({ task }: TaskGroupType) => {
  const dispatch = useAppDispatch();
  const locales = useLocales();
  const calendars = useCalendars();

  const locale = locales[0]?.languageTag ?? "en-US";
  const is24Hour = calendars[0]?.uses24hourClock ?? false;

  const time = formatTimeFromMin(task.start_time_min, locale, is24Hour);
  const duration = getDurationFromDurationMin(task.duration_min);
  const taskStatus =
    STATUS_OPTIONS.find((option) => option.value === task.status) ?? null;

  const [isCompleting, setIsCompleting] = useState<boolean>(false);

  const isVisuallyCompleted = task.is_completed || isCompleting;

  const completionProgress = useRef(
    new Animated.Value(task.is_completed ? 1 : 0),
  ).current;

  useEffect(() => {
    completionProgress.setValue(task.is_completed ? 1 : 0);
  }, [task.is_completed, completionProgress]);

  const handleRestoreCompletedTask = () => {
    Toast.hide();
    dispatch(restoreCompletedTaskAction({ taskId: task.id }));
  };

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

  const meta: MetaType[] = [];

  if (task.deadline) {
    meta.push({
      id: "deadline",
      icon: "calendar.badge.clock",
      label: `Due ${getDateLabel(task.deadline)}`,
    });
  }

  if (!task.deadline && task.start_date) {
    const prefix = isBefore(parseISO(task.start_date), startOfToday())
      ? "Started"
      : "Starts";

    meta.push({
      id: "start_date",
      icon: "calendar",
      label: `${prefix} ${getDateLabel(task.start_date)}`,
    });
  }

  if (time) {
    meta.push({
      id: "time",
      icon: "clock",
      label: time,
    });
  }

  if (duration) {
    const { hours, minutes } = duration;
    const label =
      hours && minutes
        ? `${hours}h ${minutes}m`
        : hours
          ? `${hours}h`
          : `${minutes}m`;

    meta.push({
      id: "duration",
      icon: "timer",
      label,
    });
  }

  if (taskStatus && taskStatus.value !== "next") {
    meta.push({
      id: "status",
      icon: taskStatus.icon,
      label: taskStatus.label,
    });
  }

  if (task.repeat) {
    meta.push({
      id: "repeat",
      icon: "repeat",
    });
  }

  const showMeta = !task.is_completed && meta.length > 0;

  return (
    <View style={styles.taskContainer}>
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
      {showMeta && (
        <View style={styles.taskMeta}>
          {meta.map((item) => {
            const isOverdue =
              task.deadline && task.deadline < toIsoDate(startOfToday());
            const color =
              isOverdue && item.id === "deadline" ? "#B42318" : "#77776F";

            return (
              <View key={item.id} style={styles.taskMetaItem}>
                <SymbolView
                  name={item.icon as any}
                  size={12}
                  tintColor={color}
                />
                {item.label && (
                  <Text
                    style={[
                      styles.taskMetaText,
                      {
                        color,
                      },
                    ]}
                  >
                    {item.label}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  taskContainer: {
    padding: 12,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "white",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#efefef",
    marginBottom: 12,
  },
  topTaskSide: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
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
  taskMeta: {
    marginLeft: 30,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  taskMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  taskMetaText: {
    fontSize: 12,
    lineHeight: 16,
    color: "#B42318",
    fontWeight: "500",
  },
});

export default Task;
