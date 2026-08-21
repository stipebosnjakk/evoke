import { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import { useAppSelector } from "@/hooks/storeHooks";
import { selectTaskById } from "@/store/selectors/task.selector";
import { routes } from "@/constants/routes";
import SheetWrapper from "@/components/wrappers/SheetWrapper";
import CompleteTask from "@/components/task/CompleteTask";
import { getUpcomingTaskDate } from "@/utils/taskPlacement";
import TaskMenu from "@/components/task/TaskMenu";
import FormTaskMeta from "@/components/task/FormTaskMeta";
import FormTaskAddDetails from "@/components/task/FormTaskAddDetails";
import FormTaskDescription from "@/components/task/FormTaskDescription";

type LocalSearchParamsType = {
  taskId?: string;
};

const TaskScreen = () => {
  const router = useRouter();

  const { taskId } = useLocalSearchParams<LocalSearchParamsType>();

  const task = useAppSelector((state) =>
    taskId ? selectTaskById(state, taskId) : undefined,
  );

  useEffect(() => {
    if (!task) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace(routes.today.href);
      }
    }
  }, [task, router]);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push(routes.today.href);
    }
  };

  if (!task) return null;

  return (
    <SheetWrapper>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.headerSide} onPress={handleGoBack}>
          <SymbolView
            name="xmark"
            weight="medium"
            size={20}
            type="monochrome"
            tintColor="rgb(67, 67, 67)"
          />
        </TouchableOpacity>
        <TaskMenu task={task} />
      </View>
      {task && (
        <View style={styles.contentContainer}>
          <CompleteTask
            task={task}
            variant="detail"
            isPreview={
              Boolean(task.repeat?.length) && getUpcomingTaskDate(task) !== null
            }
          />
          <FormTaskMeta task={task} />
          <FormTaskDescription task={task} />
        </View>
      )}
      {task && <FormTaskAddDetails task={task} />}
    </SheetWrapper>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  headerSide: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#F2F2F2",
  },
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    flexDirection: "column",
    gap: 20,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});

export default TaskScreen;
