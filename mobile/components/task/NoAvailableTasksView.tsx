import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

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

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={navigateToCreateTask}
        style={styles.button}
      >
        <SymbolView name="plus" size={16} tintColor="#555" />
        <Text style={styles.buttonText}>Add task</Text>
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
    gap: 10,
  },
  title: {
    fontSize: 14,
    color: "#999",
    fontWeight: "400",
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

export default NoAvailableTasksView;
