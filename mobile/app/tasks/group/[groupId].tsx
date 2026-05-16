import { useEffect } from "react";
import { FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import SheetWrapper from "@/components/wrappers/SheetWrapper";
import SheetHeader from "@/components/custom/SheetHeader";
import Task from "@/components/tasks/Task";
import { useAppSelector } from "@/hooks/storeHooks";
import { selectTasksGroupById } from "@/store/tasks/selectors/task.selector";
import { ScopeGroupId, ScopeScreenId } from "@/types/task.types";

type LocalSearchParamsType = {
  scopeId: ScopeScreenId;
  groupId: ScopeGroupId;
};

const GroupTasksScreen = () => {
  const router = useRouter();

  const { groupId } = useLocalSearchParams<LocalSearchParamsType>();

  const { title, tasks } = useAppSelector((state) =>
    selectTasksGroupById(state, groupId),
  );

  useEffect(() => {
    if (tasks.length === 0) router.back();
  }, [tasks, router]);

  return (
    <SheetWrapper style={{ flex: 1 }}>
      <SheetHeader title={title} />
      <FlatList
        data={tasks}
        keyExtractor={(task) => task.id}
        renderItem={({ item }) => <Task task={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      />
    </SheetWrapper>
  );
};

export default GroupTasksScreen;
