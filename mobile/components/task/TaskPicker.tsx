import { View, Text, StyleSheet, Pressable } from "react-native";
import { SymbolView } from "expo-symbols";
import { TaskStateData } from "@/types/task.types";
import TaskMeta from "./TaskMeta";
type SelectTaskProps = {
  task: TaskStateData;
  isSelected: boolean;
  onPress: () => void;
};
const TaskPicker = ({ task, isSelected, onPress }: SelectTaskProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.taskContainer, isSelected && styles.taskContainerSelected]}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle} numberOfLines={1} ellipsizeMode="tail">
          {task.title}
        </Text>
        <View style={styles.completionCircle}>
          {isSelected && <View style={styles.completionCircleFill} />}
          {isSelected && (
            <View style={styles.completionCheck}>
              <SymbolView
                name="checkmark"
                size={10}
                weight="bold"
                tintColor="#FFFFFF"
              />
            </View>
          )}
        </View>
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
});
export default TaskPicker;
