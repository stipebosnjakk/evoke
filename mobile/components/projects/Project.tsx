import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SymbolView } from "expo-symbols";
import { Project as ProjectType } from "@/db";

type ProjectProps = {
  project: ProjectType;
};

const Project = ({ project }: ProjectProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeftSideContainer}>
          <View
            style={[styles.colorContainer, { backgroundColor: project.color }]}
          />
          <View style={styles.priorityBadge}>
            <Text style={styles.priorityBadgeText}>{project.status}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <SymbolView
            name="ellipsis"
            size={20}
            type="monochrome"
            tintColor="#9CA3AF"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.textContainer}>
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={styles.projectTitle}
        >
          {project.name}
        </Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.completedTasksRow}>
          <SymbolView
            name="checkmark"
            size={13}
            type="monochrome"
            tintColor="#71717A"
          />
          <Text style={styles.completedTasksText}>6/9 completed tasks</Text>
        </View>
        <TouchableOpacity style={styles.addTaskButton} activeOpacity={0.7}>
          <SymbolView
            name="plus"
            size={17}
            type="monochrome"
            tintColor="#71717A"
          />
          <Text style={styles.addTaskText}>Add task</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  projectTitle: {
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
  completedTasksText: {
    color: "#71717A",
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 14,
  },
  addTaskButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  addTaskText: {
    color: "#71717A",
    fontSize: 11,
    fontWeight: "500",
    lineHeight: 14,
  },
});

export default Project;
