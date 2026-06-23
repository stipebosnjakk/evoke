import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";

import { routes } from "@/constants/routes";
import { setProjectId } from "@/store/slices/newTask.slice";

type NoProjectTasksViewType = {
  projectId: string;
  projectName?: string;
};

const NoProjectTasksView = ({
  projectId,
  projectName,
}: NoProjectTasksViewType) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const navigateToAddTasks = () => {
    router.push({
      pathname: routes.add_tasks_to_project.href,
      params: { projectId },
    });
  };

  const navigateToCreateTask = () => {
    dispatch(setProjectId({ projectId }));
    router.push(routes.create_task.href);
  };

  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.titleText}>No tasks in this project</Text>
      <Text style={styles.subtitleText}>
        {projectName
          ? `${projectName} does not have any tasks yet. Add existing tasks or create a new one for this project.`
          : "This project does not have any tasks yet. Add existing tasks or create a new one."}
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={navigateToAddTasks}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Add Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={navigateToCreateTask}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Create Task</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: "#7B8798",
    textAlign: "center",
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 28,
    alignItems: "center",
    gap: 14,
  },
  primaryButton: {
    width: "86%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#191919",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  secondaryButton: {
    width: "86%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "#efefef",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
});

export default NoProjectTasksView;
