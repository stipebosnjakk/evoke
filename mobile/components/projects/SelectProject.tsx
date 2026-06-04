import { Platform, View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

import { useAppSelector } from "@/hooks/storeHooks";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { setProjectId } from "@/store/slices/newTask.slice";
import {
  selectProjectById,
  selectProjects,
} from "@/store/selectors/projects.selector";
import { Option } from "@rn-primitives/select";

type LocalSearchParamsType = {
  projectId?: string;
};

const SelectProject = () => {
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const { projectId } = useLocalSearchParams<LocalSearchParamsType>();

  const projects = useAppSelector((state) => selectProjects(state).list);
  const newTaskProjectId = useAppSelector(
    (state) => state.newTask.task.project_id,
  );
  const selectedProject = useAppSelector((state) =>
    selectProjectById(state, newTaskProjectId ?? undefined),
  );

  const selectedProjectValue: Option = selectedProject
    ? {
        label: selectedProject.name,
        value: selectedProject.id,
      }
    : undefined;

  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({
      ios: insets.bottom,
      android: insets.bottom + 24,
    }),
    left: 12,
    right: 12,
  };

  useEffect(() => {
    if (projectId) {
      dispatch(setProjectId({ projectId }));
    }
  }, [projectId, dispatch]);

  const handleOnValueChange = (project: Option) => {
    if (!project) return;
    if (newTaskProjectId === project.value) {
      dispatch(setProjectId({ projectId: null }));
      return;
    }
    dispatch(setProjectId({ projectId: project.value }));
  };

  //   TODO: fetch only active and archieved projects, add limits to projects, and later on on completed tasks

  return (
    <Select
      value={selectedProjectValue}
      disabled={projects.length === 0}
      onValueChange={(project) => {
        handleOnValueChange(project);
      }}
    >
      <SelectTrigger style={styles.width}>
        {selectedProject ? (
          <>
            <View
              style={[
                styles.colorContainer,
                { backgroundColor: selectedProject.color },
              ]}
            />
            <SelectValue
              placeholder={selectedProjectValue?.label || "Project"}
            />
          </>
        ) : (
          <SelectValue placeholder={"Project"} />
        )}
      </SelectTrigger>
      <SelectContent
        insets={contentInsets}
        style={styles.width}
        sideOffset={6}
        align="start"
      >
        <SelectGroup>
          {projects.map((project) => (
            <SelectItem
              key={project.id}
              label={project.name}
              value={project.id}
            >
              <View style={styles.selectItemContainer}>
                <View
                  style={[
                    styles.colorContainer,
                    { backgroundColor: project.color },
                  ]}
                />
                <Text
                  style={styles.projectName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {project.name}
                </Text>
              </View>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const styles = StyleSheet.create({
  selectItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
  },
  colorContainer: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  projectName: {
    color: "#18181B",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
  },
  createProjectButton: {
    height: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "flex-start",
  },
  createProjectText: {
    color: "#52525B",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 18,
  },
  width: {
    width: 180,
  },
});

export default SelectProject;
