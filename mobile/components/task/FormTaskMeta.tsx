import { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import { STATUS_OPTIONS } from "@/constants/status";
import { routes } from "@/constants/routes";
import { isBefore, parseISO, startOfToday } from "date-fns";
import {
  formatTimeFromMin,
  getDateLabel,
  getDurationLabel,
  getRepeatLabel,
} from "@/utils/date";
import { useCalendars, useLocales } from "expo-localization";
import { type TaskStateData } from "@/types/task.types";

type TaskMetaProps = {
  task: TaskStateData;
};

const FormTaskMeta = ({ task }: TaskMetaProps) => {
  const router = useRouter();
  const locales = useLocales();
  const calendars = useCalendars();

  const locale = locales[0]?.languageTag ?? "en-US";
  const is24Hour = calendars[0]?.uses24hourClock ?? false;

  const meta = useMemo(() => {
    const items = [];

    if (task.project) {
      items.push({
        id: "project",
        icon: "folder",
        label: task.project.name,
        onPress: () => {
          router.replace({
            pathname: routes.single_project.href,
            params: {
              projectId: task.project!.id,
            },
          });
        },
      });
    }

    if (task.status) {
      const status =
        STATUS_OPTIONS.find((option) => option.value === task.status) ?? null;

      if (status) {
        items.push({
          id: "status",
          icon: status.icon,
          label: status.label,
          onPress: () =>
            router.push({
              pathname: routes.form_task_status.href,
              params: {
                taskId: task.id,
                scope: "field",
              },
            }),
        });
      }
    }

    if (task.start_date) {
      const prefix = isBefore(parseISO(task.start_date), startOfToday())
        ? "Started"
        : "Starts";

      items.push({
        id: "start_date",
        icon: "calendar",
        label: `${prefix} ${getDateLabel(task.start_date)}`,
        onPress: () =>
          router.push({
            pathname: routes.form_task_date.href,
            params: {
              taskId: task.id,
              scope: "field",
            },
          }),
      });
    }

    if (task.deadline) {
      items.push({
        id: "deadline",
        icon: "calendar.badge.clock",
        label: `Due ${getDateLabel(task.deadline)}`,
        onPress: () =>
          router.push({
            pathname: routes.form_task_deadline.href,
            params: {
              taskId: task.id,
              scope: "field",
            },
          }),
      });
    }

    if (task.start_date || task.repeat) {
      if (task.start_time_min) {
        const time = formatTimeFromMin(task.start_time_min, locale, is24Hour);

        items.push({
          id: "time",
          icon: "clock",
          label: time ?? "Time",
          onPress: () =>
            router.push({
              pathname: routes.form_task_time.href,
              params: {
                taskId: task.id,
                scope: "field",
              },
            }),
        });
      }
    }

    if (task.duration_min) {
      items.push({
        id: "duration",
        icon: "timer",
        label: getDurationLabel(task.duration_min),
        onPress: () =>
          router.push({
            pathname: routes.form_task_duration.href,
            params: {
              taskId: task.id,
              scope: "field",
            },
          }),
      });
    }

    if (task.repeat?.length) {
      items.push({
        id: "repeat",
        icon: "repeat",
        label: getRepeatLabel(task.repeat),
        onPress: () =>
          router.push({
            pathname: routes.form_task_repeat.href,
            params: {
              taskId: task.id,
              scope: "field",
            },
          }),
      });
    }

    return items;
  }, [task, locale, is24Hour, router]);

  if (!meta.length) return null;

  return (
    <View style={styles.wrapper}>
      {meta.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.container}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <SymbolView
            name={item.icon as any}
            size={14}
            weight="medium"
            tintColor="#71717A"
          />

          <Text style={styles.text} numberOfLines={1}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 20,
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 9,
    backgroundColor: "#FAFAFA",
  },
  text: {
    color: "#52525B",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "500",
  },
});

export default FormTaskMeta;
