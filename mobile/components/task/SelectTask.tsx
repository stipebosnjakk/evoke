import { View, Text, StyleSheet, Pressable } from "react-native";
import { SymbolView } from "expo-symbols";

import { TaskStateData } from "@/types/task.types";
import TaskMeta from "./TaskMeta";

type SelectTaskProps = {
  task: TaskStateData;
  isSelected: boolean;
  onPress: () => void;
};

const SelectTask = ({ task, isSelected, onPress }: SelectTaskProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.taskContainer, isSelected && styles.taskContainerSelected]}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle} numberOfLines={1} ellipsizeMode="tail">
          {task.title}
        </Text>
      </View>
      {!task.is_completed && (
        <View style={styles.taskMetaContainer}>
          {task.project && (
            <View style={styles.taskMetaItem}>
              <SymbolView
                name="circle.fill"
                size={6}
                tintColor={task.project.color}
              />
              <Text style={styles.taskMetaText}>{task.project.name}</Text>
            </View>
          )}
          <TaskMeta task={task} />
        </View>
      )}
    </Pressable>
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
  taskContainerSelected: {
    borderColor: "#BDB7AD",
  },
  taskMetaContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: 0,
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
  taskHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  taskTitle: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
    color: "#1F1F1D",
  },
});
export default SelectTask;
