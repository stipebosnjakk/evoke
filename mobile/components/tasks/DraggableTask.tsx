import { memo } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { format } from "date-fns";

import { TaskWithOrderKey } from "@/types/task.types";

export type RenderDraggableTask = {
  item: TaskWithOrderKey;
  drag: () => void;
};

const DraggableTask = ({ item, drag }: RenderDraggableTask) => {
  const { task } = item;
  const date = format(new Date(task.created_at), "d MMM");

  const InboxTask = (
    <TouchableOpacity
      activeOpacity={0.7}
      delayLongPress={100}
      style={styles.inboxTaskCardContainer}
      onLongPress={drag}
    >
      <Text numberOfLines={1} style={styles.inboxTaskTitleText}>
        {task.title}
      </Text>
      <Text style={styles.inboxTaskCreatedDateText}>{date}</Text>
    </TouchableOpacity>
  );

  return InboxTask;
};

const styles = StyleSheet.create({
  inboxTaskCardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E6EAF0",
    paddingHorizontal: 15,
    paddingVertical: 12,
    elevation: 1,
    marginBottom: 14,
  },
  inboxTaskCreatedDateText: {
    fontSize: 12,
    fontWeight: "400",
    color: "#7B8798",
    marginTop: 4,
  },
  inboxTaskTitleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
    letterSpacing: 0.2,
  },
});

export default memo(DraggableTask);
