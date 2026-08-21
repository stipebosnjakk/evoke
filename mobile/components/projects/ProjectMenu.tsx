import { Pressable, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch } from "@/hooks/storeHooks";
import { Text } from "@/components/ui/text";
import { setColor, setName } from "@/store/slices/formProject.slice";
import { routes } from "@/constants/routes";
import { completeProjectAction } from "@/store/thunks/project/project.completion.thunks";
import { deleteProjectAction } from "@/store/thunks/project/project.crud.thunks";
import { ProjectStateData } from "@/types/project.types";
import { showAlert } from "@/utils/error";

type ProjectMenuType = {
  project: ProjectStateData;
};

const ProjectMenu = ({ project }: ProjectMenuType) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

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
      await dispatch(completeProjectAction({ projectId: project.id })).unwrap();

      Toast.hide();
      Toast.show({
        type: "info",
        text1: project.name,
        text2: "Project completed",
        position: "bottom",
      });
    } catch (error) {
      console.error("Failed to complete project:", error);
    }
  };

  const handleDeleteProject = async () => {
    try {
      await dispatch(deleteProjectAction({ projectId: project.id })).unwrap();

      Toast.hide();
      Toast.show({
        type: "info",
        text1: project.name,
        text2: "Project deleted",
        position: "bottom",
      });
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  };

  const confirmCompleteProject = () => {
    showAlert({
      title: "Complete this project?",
      message:
        "This will also complete all unfinished tasks inside it. This action cannot be undone.",
      actionLabel: "Complete",
      variant: "default",
      onConfirm: handleCompleteProject,
    });
  };

  const confirmDeleteProject = () => {
    showAlert({
      title: "Delete this project?",
      message:
        "All tasks inside this project will also be deleted. This action cannot be undone.",
      actionLabel: "Delete Project",
      variant: "destructive",
      onConfirm: handleDeleteProject,
    });
  };

  return (
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
                  {project.tasks.length}{" "}
                  {project.tasks.length === 1 ? "task" : "tasks"}
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
        {project.status !== "completed" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onPress={confirmCompleteProject}>
              <SymbolView
                name="checkmark.circle"
                size={23}
                type="monochrome"
                tintColor="#3F3F46"
              />
              <Text style={styles.itemText}>Mark as Completed</Text>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onPress={confirmDeleteProject}>
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
