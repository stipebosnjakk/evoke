import { StyleSheet, TouchableOpacity } from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "@/components/ui/text";
import { routes } from "@/constants/routes";
import { setProjectId } from "@/store/slices/newTask.slice";

type AddTaskMenuType = {
  projectId: string;
};

const AddTaskMenu = ({ projectId }: AddTaskMenuType) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const navigateToTaskCreate = () => {
    dispatch(setProjectId({ projectId }));
    router.push(routes.form_task.href);
  };

  const navigateToAddExistingTasks = () => {
    router.push({
      pathname: routes.add_tasks_to_project.href,
      params: { projectId },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TouchableOpacity style={styles.addTaskButton} activeOpacity={0.7}>
          <SymbolView
            name="plus"
            size={17}
            type="monochrome"
            tintColor="#71717A"
          />
          <Text style={styles.addTaskText}>Add task</Text>
        </TouchableOpacity>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={6} style={styles.content}>
        <DropdownMenuItem onPress={navigateToTaskCreate}>
          <SymbolView
            name="plus.circle"
            size={23}
            type="monochrome"
            tintColor="#3F3F46"
          />
          <Text style={styles.itemText}>Create New Task</Text>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onPress={navigateToAddExistingTasks}>
          <SymbolView
            name="tray.and.arrow.down"
            size={23}
            type="monochrome"
            tintColor="#3F3F46"
          />
          <Text style={styles.itemText}>Add Existing Task</Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const styles = StyleSheet.create({
  content: {
    width: 240,
  },
  itemText: {
    color: "#3F3F46",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 20,
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

export default AddTaskMenu;
