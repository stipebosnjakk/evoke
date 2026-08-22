import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { SymbolView } from "expo-symbols";

import { routes } from "@/constants/routes";
import { setProjectId } from "@/store/slices/formTask.slice";

type NoProjectTasksViewType = {
  projectId: string;
};

const NoProjectTasksView = ({ projectId }: NoProjectTasksViewType) => {
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

    router.push({
      pathname: routes.form_task.href,
      params: {
        mode: "create",
      },
    });
  };

  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.titleText}>No tasks in this project</Text>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={navigateToAddTasks}
          style={styles.button}
        >
          <SymbolView name="plus" size={16} tintColor="#555" />
          <Text style={styles.buttonText}>Add tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={navigateToCreateTask}
          style={styles.button}
        >
          <SymbolView name="checkmark.circle" size={16} tintColor="#555" />
          <Text style={styles.buttonText}>Create task</Text>
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
    gap: 10,
  },
  titleText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "400",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: 1,
    borderColor: "#C7C7C7",
    borderStyle: "dashed",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
});

export default NoProjectTasksView;
