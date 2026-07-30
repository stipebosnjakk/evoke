import { useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import Alert from "@/components/custom/Alert";
import { useAppDispatch } from "@/hooks/storeHooks";
import { routes } from "@/constants/routes";
import { TaskStateData } from "@/types/task.types";
import { removeTaskFromProjectAction } from "@/store/thunks/project/project.tasks.thunks";
import { deleteTaskAction } from "@/store/thunks/task/task.crud.thunks";
import { editTask } from "@/store/slices/formTask.slice";

type TaskMenuProps = {
  task: TaskStateData;
};

const TaskMenu = ({ task }: TaskMenuProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [removeAlertOpen, setRemoveAlertOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);

  const navigateToEditTask = () => {
    dispatch(editTask({ task }));
    router.push({
      pathname: routes.form_task.href,
      params: {
        mode: "edit",
        taskId: task.id,
      },
    });
  };

  const handleRemoveFromProject = async () => {
    if (!task.project) return;

    try {
      await dispatch(
        removeTaskFromProjectAction({
          taskId: task.id,
        }),
      ).unwrap();

      setRemoveAlertOpen(false);
    } catch (error) {
      console.error("Failed to remove task from project:", error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await dispatch(
        deleteTaskAction({
          taskId: task.id,
        }),
      ).unwrap();

      setDeleteAlertOpen(false);

      if (router.canGoBack()) {
        router.back();
      } else {
        router.push(routes.today.href);
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Pressable hitSlop={10} style={styles.trigger}>
            <SymbolView
              name="ellipsis"
              weight="medium"
              size={24}
              type="monochrome"
              tintColor="rgb(67, 67, 67)"
            />
          </Pressable>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={6} style={styles.content}>
          <DropdownMenuItem onPress={navigateToEditTask}>
            <SymbolView
              name="square.and.pencil"
              size={22}
              type="monochrome"
              tintColor="#3F3F46"
            />
            <Text style={styles.itemText}>Edit Task</Text>
          </DropdownMenuItem>
          {task.project && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onPress={() => setRemoveAlertOpen(true)}
              >
                <SymbolView
                  name="folder.badge.minus"
                  size={22}
                  type="monochrome"
                  tintColor="#DC2626"
                />
                <Text style={styles.destructiveText}>Remove from Project</Text>
              </DropdownMenuItem>
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onPress={() => setDeleteAlertOpen(true)}
          >
            <SymbolView
              name="trash"
              size={22}
              type="monochrome"
              tintColor="#DC2626"
            />
            <Text style={styles.destructiveText}>Delete Task</Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Alert
        open={removeAlertOpen}
        onOpenChange={setRemoveAlertOpen}
        title="Remove from project?"
        subtitle={`This task will be removed from ${task.project?.name}, but it will not be deleted.`}
        onAction={handleRemoveFromProject}
        actionLabel="Remove from Project"
        buttonVariant="destructive"
      />
      <Alert
        open={deleteAlertOpen}
        onOpenChange={setDeleteAlertOpen}
        title="Delete this task?"
        subtitle="This action cannot be undone."
        onAction={handleDeleteTask}
        actionLabel="Delete Task"
        buttonVariant="destructive"
      />
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#F2F2F2",
  },
  content: {
    width: 240,
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

export default TaskMenu;
