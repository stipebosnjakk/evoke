import { View, Text, StyleSheet, Pressable } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import ProjectMenu from "./ProjectMenu";
import AddTaskMenu from "./AddTaskMenu";
import { ProjectStateData } from "@/types/project.types";
import { routes } from "@/constants/routes";

type ProjectProps = {
  project: ProjectStateData;
};

const Project = ({ project }: ProjectProps) => {
  const router = useRouter();

  const navigateToSingleProject = () => {
    router.push({
      pathname: routes.single_project.href,
      params: { projectId: project.id },
    });
  };

  return (
    <Pressable style={styles.container} onPress={navigateToSingleProject}>
      <View style={styles.header}>
        <View style={styles.headerLeftSideContainer}>
          <View
            style={[styles.colorContainer, { backgroundColor: project.color }]}
          />
          <View style={styles.priorityBadge}>
            <Text style={styles.priorityBadgeText}>{project.status}</Text>
          </View>
        </View>
        <ProjectMenu project={project} tasksCount={12} />
      </View>
      <View style={styles.textContainer}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.projectName}>
          {project.name}
        </Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.completedTasksRow}>
          <SymbolView
            name="list.bullet"
            size={13}
            type="monochrome"
            tintColor="#71717A"
          />
          <Text style={styles.tasksLengthText}>
            {project.tasks.length === 1
              ? `${project.tasks.length} task`
              : `${project.tasks.length} tasks`}
          </Text>
        </View>
        <AddTaskMenu projectId={project.id} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#efefef",
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeftSideContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  colorContainer: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  textContainer: {
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 8,
  },
  projectName: {
    color: "#18181B",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 18,
  },
  projectMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  projectDateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  projectDateText: {
    color: "#71717A",
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 14,
  },
  priorityBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F2F4",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
  },
  priorityBadgeText: {
    color: "#71717A",
    fontSize: 10,
    fontWeight: "600",
    lineHeight: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F1F1F1",
    paddingTop: 8,
    marginTop: 10,
  },
  completedTasksRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  tasksLengthText: {
    color: "#71717A",
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 14,
  },
});

export default Project;
