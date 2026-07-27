import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import { TaskStateData } from "@/types/task.types";
import CompleteTask from "./CompleteTask";
import TaskMeta from "./TaskMeta";
import { routes } from "@/constants/routes";

type TaskGroupType = {
  task: TaskStateData;
  onDrag?: () => void;
  isPreview?: boolean;
};

const Task = ({ task, onDrag, isPreview = false }: TaskGroupType) => {
  const router = useRouter();

  const [isDragging, setIsDragging] = useState(false);

  const handleOnLongPress = () => {
    if (!onDrag) return;
    setIsDragging(true);
    onDrag();
  };

  const navigateToTask = () => {
    router.push({
      pathname: routes.single_task.href,
      params: { taskId: task.id },
    });
  };

  return (
    <Pressable
      style={[styles.taskContainer, isDragging && { opacity: 0.4 }]}
      onPress={navigateToTask}
    >
      <View style={styles.taskHeader}>
        <CompleteTask task={task} isPreview={isPreview} />
        {onDrag && (
          <TouchableOpacity
            style={styles.menuIcon}
            onLongPress={handleOnLongPress}
            onPressOut={() => setIsDragging(false)}
            delayLongPress={100}
          >
            <SymbolView
              name="line.3.horizontal"
              size={26}
              tintColor="#DADADA"
            />
          </TouchableOpacity>
        )}
      </View>
      {!task.is_completed && task.repeat_today_status !== "completed_today" && (
        <View style={styles.taskMetaContainer}>
          {task.project && (
            <View style={styles.taskMetaItem}>
              <SymbolView
                name="circle.fill"
                size={6}
                tintColor={task.project.color}
              />
              <Text
                style={styles.taskMetaText}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {task.project.name}
              </Text>
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
  taskMetaContainer: {
    width: "100%",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: 30,
    paddingRight: 30,
  },
  taskMetaItem: {
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 4,
  },
  taskMetaText: {
    flexShrink: 1,
    minWidth: 0,
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
  menuIcon: {
    flexShrink: 0,
  },
});

export default Task;
