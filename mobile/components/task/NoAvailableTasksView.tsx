import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

import { routes } from "@/constants/routes";
import { useAppDispatch } from "@/hooks/storeHooks";
import { setProjectId } from "@/store/slices/formTask.slice";

type NoAvailableTasksViewProps = {
  projectId: string;
};

const NoAvailableTasksView = ({ projectId }: NoAvailableTasksViewProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const navigateToCreateTask = () => {
    dispatch(setProjectId({ projectId }));
    router.replace({
      pathname: routes.form_task.href,
      params: {
        mode: "create",
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>No available tasks</Text>
      <Text style={styles.subtitle}>
        There are no unassigned tasks available. Create a new task and it will
        be added directly to this project.
      </Text>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={navigateToCreateTask}
        style={styles.primaryButton}
      >
        <Text style={styles.primaryButtonText}>Create Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 10,
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: "#7B8798",
    textAlign: "center",
  },
  primaryButton: {
    width: "86%",
    height: 56,
    marginTop: 28,
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
});

export default NoAvailableTasksView;
