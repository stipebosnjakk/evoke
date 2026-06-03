import { useEffect } from "react";
import { FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import SheetWrapper from "@/components/wrappers/SheetWrapper";
import SheetHeader from "@/components/custom/SheetHeader";
import Task from "@/components/task/Task";
import Project from "@/components/projects/Project";
import { useAppSelector } from "@/hooks/storeHooks";
import { selectGroupById } from "@/store/selectors/task.selector";
import { ScopeGroupId, ScopeScreenId } from "@/types/scope.types";
import { PROJECTS_SCOPE_ID } from "@/constants/scopeIds";

type LocalSearchParamsType = {
  groupId: ScopeGroupId;
  scopeId: ScopeScreenId;
};

const GroupScreen = () => {
  const router = useRouter();

  const { groupId, scopeId } = useLocalSearchParams<LocalSearchParamsType>();

  const { title, data } = useAppSelector((state) =>
    selectGroupById(state, groupId),
  );

  useEffect(() => {
    if (data.length === 0) router.back();
  }, [data, router]);

  const renderItem = ({ item }: { item: any }) => {
    return scopeId === PROJECTS_SCOPE_ID ? (
      <Project project={item} />
    ) : (
      <Task task={item} />
    );
  };

  return (
    <SheetWrapper style={{ flex: 1 }}>
      <SheetHeader title={title} />
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      />
    </SheetWrapper>
  );
};

export default GroupScreen;
