import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch } from "@/hooks/storeHooks";
import { Text } from "@/components/ui/text";
import { setColor, setName } from "@/store/slices/newProject.slice";
import { routes } from "@/constants/routes";
import Alert from "./Alert";
import {
  completeProjectAction,
  completeProjectTasksAction,
} from "@/store/thunks/update.thunks";
import { ProjectStateData } from "@/types/project.types";

type ProjectMenuType = {
  project: ProjectStateData;
  tasksCount: number;
};

const ProjectMenu = ({ project, tasksCount }: ProjectMenuType) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [completeAlertOpen, setCompleteAlertOpen] = useState(false);

  const navigateToEditProject = () => {
    dispatch(setName({ name: project.name }));
    dispatch(setColor({ color: project.color }));

    router.push({
      pathname: routes.form_project.href,
      params: { mode: "edit", projectId: project.id },
    });
  };

  const handleCompleteProject = async () => {
    try {
      const taskIds = project.tasks.map((task) => task.id);

      await dispatch(
        completeProjectAction({
          projectId: project.id,
        }),
      ).unwrap();

      await dispatch(
        completeProjectTasksAction({
          projectId: project.id,
          taskIds,
        }),
      ).unwrap();

      setCompleteAlertOpen(false);
    } catch (error) {
      console.error("Failed to complete project:", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Pressable hitSlop={10}>
            <SymbolView
              name="ellipsis"
              size={20}
              type="monochrome"
              tintColor="#9CA3AF"
            />
          </Pressable>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={6} style={styles.content}>
          <DropdownMenuItem onPress={navigateToEditProject}>
            <View style={styles.projectMenuItem}>
              <View style={styles.projectMenuItemLeftSide}>
                <View
                  style={[
                    styles.projectColor,
                    { backgroundColor: project.color },
                  ]}
                />
                <View style={styles.projectTextContainer}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.projectName}
                  >
                    {project.name}
                  </Text>
                  <Text style={styles.taskCount}>
                    {tasksCount} {tasksCount === 1 ? "task" : "tasks"}
                  </Text>
                </View>
              </View>
              <SymbolView
                name="square.and.pencil"
                size={20}
                type="monochrome"
                tintColor="#3F3F46"
              />
            </View>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onPress={() => setCompleteAlertOpen(true)}>
            <SymbolView
              name="checkmark.circle"
              size={23}
              type="monochrome"
              tintColor="#3F3F46"
            />
            <Text style={styles.itemText}>Mark as Completed</Text>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SymbolView
              name="archivebox"
              size={23}
              type="monochrome"
              tintColor="#3F3F46"
            />
            <Text style={styles.itemText}>Archive Project</Text>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <SymbolView
              name="trash"
              size={23}
              type="monochrome"
              tintColor="#DC2626"
            />
            <Text style={styles.destructiveText}>Delete Project</Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Alert
        open={completeAlertOpen}
        onOpenChange={setCompleteAlertOpen}
        title="Complete this project?"
        subtitle="This will also complete all unfinished tasks inside it."
        onAction={handleCompleteProject}
      />
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    width: 280,
  },
  projectMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    minWidth: 0,
    gap: 12,
  },
  projectMenuItemLeftSide: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  projectTextContainer: {
    flex: 1,
    minWidth: 0,
  },
  projectColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  projectName: {
    color: "#18181B",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 20,
    flexShrink: 1,
  },
  taskCount: {
    color: "#71717A",
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  itemText: {
    color: "#3F3F46",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 20,
  },
  destructiveText: {
    color: "#DC2626",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 20,
  },
});

export default ProjectMenu;
