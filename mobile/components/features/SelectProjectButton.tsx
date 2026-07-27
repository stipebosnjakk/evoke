import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import { useAppSelector } from "@/hooks/storeHooks";
import { routes } from "@/constants/routes";
import { selectProjectById } from "@/store/selectors/projects.selector";

const SelectProjectButton = () => {
  const router = useRouter();

  const newProjectId = useAppSelector((state) => state.formTask.task.project_id);
  const project = useAppSelector((state) =>
    selectProjectById(state, newProjectId),
  );

  const navigateToSelectProject = () => {
    router.push(routes.form_task_project.href);
  };

  return (
    <TouchableOpacity
      style={styles.projectSelector}
      onPress={navigateToSelectProject}
    >
      <SymbolView
        name="folder"
        size={20}
        type="monochrome"
        tintColor="#6B6B6B"
      />
      <Text
        style={styles.projectSelectorText}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {project?.name ?? "Select project"}
      </Text>
      <SymbolView name="chevron.down" size={13} tintColor="#6B6B6B" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  projectSelector: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
    marginRight: 16,
    paddingVertical: 12,
  },
  projectSelectorText: {
    flexShrink: 1,
    minWidth: 0,
    fontSize: 13,
    lineHeight: 28,
    fontWeight: "500",
    color: "#6B6B6B",
  },
});

export default SelectProjectButton;
