import { View, Text, StyleSheet } from "react-native";
import { useCalendars, useLocales } from "expo-localization";
import { SymbolView } from "expo-symbols";

import { TaskStateData } from "@/types/task.types";
import { isBefore, parseISO, startOfToday } from "date-fns";
import { STATUS_OPTIONS } from "@/constants/status";
import {
  formatTimeFromMin,
  getDateLabel,
  getDurationFromDurationMin,
  toIsoDate,
} from "@/utils/date";

type TaskMetaType = {
  task: TaskStateData;
};

type MetaType = {
  id: string;
  icon: string;
  label?: string;
};

const TaskMeta = ({ task }: TaskMetaType) => {
  const locales = useLocales();
  const calendars = useCalendars();

  const locale = locales[0]?.languageTag ?? "en-US";
  const is24Hour = calendars[0]?.uses24hourClock ?? false;

  const time = formatTimeFromMin(task.start_time_min, locale, is24Hour);
  const duration = getDurationFromDurationMin(task.duration_min);
  const taskStatus =
    STATUS_OPTIONS.find((option) => option.value === task.status) ?? null;

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

  if (task.is_completed || meta.length === 0) return null;

  return (
    <View style={styles.taskMeta}>
      {meta.map((item) => {
        const isOverdue =
          task.deadline && task.deadline < toIsoDate(startOfToday());
        const color =
          isOverdue && item.id === "deadline" ? "#B42318" : "#77776F";

        return (
          <View key={item.id} style={styles.taskMetaItem}>
            <SymbolView name={item.icon as any} size={12} tintColor={color} />
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
  );
};

const styles = StyleSheet.create({
  taskMetaContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: 30,
  },
  taskMeta: {
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
    color: "#77776F",
    fontWeight: "500",
  },
});

export default TaskMeta;
