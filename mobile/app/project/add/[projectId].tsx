import { useState } from "react";
import { FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import SheetWrapper from "@/components/wrappers/SheetWrapper";
import SheetHeader from "@/components/custom/SheetHeader";
import TaskPicker from "@/components/task/TaskPicker";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { selectTasksWithoutProject } from "@/store/selectors/task.selector";
import { addTasksToProjectAction } from "@/store/thunks/project/project.tasks.thunks";
import { TaskStateData } from "@/types/task.types";
import NoAvailableTasksView from "@/components/task/NoAvailableTasksView";

type LocalSearchParamsType = {
  projectId: string;
};

const AddTasksToProjectFormSheet = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { projectId } = useLocalSearchParams<LocalSearchParamsType>();

  const tasks = useAppSelector(selectTasksWithoutProject);

  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleTask = (taskId: string) => {
    setSelectedTaskIds((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId],
    );
  };

  const handleSubmit = async () => {
    if (!projectId || !selectedTaskIds.length || isSubmitting) return;

    try {
      setIsSubmitting(true);

      await dispatch(
        addTasksToProjectAction({
          taskIds: selectedTaskIds,
          projectId,
        }),
      ).unwrap();

      setSelectedTaskIds([]);
      router.back();
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderItem = ({ item }: { item: TaskStateData }) => (
    <TaskPicker
      task={item}
      isSelected={selectedTaskIds.includes(item.id)}
      onPress={() => toggleTask(item.id)}
    />
  );

  return (
    <SheetWrapper>
      <SheetHeader
        title="Add Tasks"
        submitButtonVisible={tasks.length > 0}
        submitDisabled={selectedTaskIds.length === 0 || isSubmitting}
        onSubmit={handleSubmit}
      />
      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(task) => task.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
          renderItem={renderItem}
        />
      ) : (
        <NoAvailableTasksView projectId={projectId} />
      )}
    </SheetWrapper>
  );
};

export default AddTasksToProjectFormSheet;
