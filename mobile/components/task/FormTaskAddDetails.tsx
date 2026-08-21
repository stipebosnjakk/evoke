import { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

import Chip from "@/components/custom/Chip";
import { type TaskStateData } from "@/types/task.types";
import { routes } from "@/constants/routes";

type TaskAddDetailsProps = {
  task: TaskStateData;
};

const FormTaskAddDetails = ({ task }: TaskAddDetailsProps) => {
  const router = useRouter();

  const addDetails = useMemo(() => {
    const items = [];

    if (!task.project) {
      items.push({
        id: "project",
        icon: "folder",
        label: "Select project",
        onPress: () =>
          router.push({
            pathname: routes.form_task_project.href,
            params: {
              taskId: task.id,
              scope: "field",
            },
          }),
      });
    }

    if (!task.status) {
      items.push({
        id: "status",
        icon: "tag",
        label: "Status",
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

    if (!task.start_date) {
      items.push({
        id: "start_date",
        icon: "calendar",
        label: "Date",
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

    if (!task.deadline) {
      items.push({
        id: "deadline",
        icon: "calendar.badge.clock",
        label: "Deadline",
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

    if ((task.start_date || task.repeat) && !task.start_time_min) {
      items.push({
        id: "time",
        icon: "clock",
        label: "Time",
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

    if (!task.duration_min) {
      items.push({
        id: "duration",
        icon: "timer",
        label: "Duration",
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

    if (!task.repeat?.length) {
      items.push({
        id: "repeat",
        icon: "repeat",
        label: "Repeat",
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
  }, [task, router]);

  if (!addDetails.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Add more details</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.row}
      >
        {addDetails.map((detail) => (
          <Chip
            key={detail.id}
            icon={detail.icon}
            label={detail.label}
            onPress={detail.onPress}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    width: "100%",
    gap: 10,
    marginTop: 40,
  },
  title: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "600",
    color: "#8C8C87",
    marginLeft: 20,
  },
  row: {
    alignItems: "flex-start",
    gap: 8,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
});

export default FormTaskAddDetails;
