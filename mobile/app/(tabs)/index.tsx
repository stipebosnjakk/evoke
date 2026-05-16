import { useMemo } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import NoTasksViewWrapper from "@/components/tasks/NoTasksViewWrapper";
import { useAppSelector } from "@/hooks/storeHooks";
import { selectTodayTasks } from "@/store/tasks/selectors/task.selector";
import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import { GroupByIdType } from "@/types/initialState.types";
import GroupFlatList from "@/components/tasks/GroupFlatList";
import Task from "@/components/tasks/Task";
import {
  TODAY_SCOPE_ID,
  TODAY_SCOPE_COMPLETED_ID,
  TODAY_SCOPE_DUE_TODAY_ID,
  TODAY_SCOPE_OVERDUE_ID,
  TODAY_SCOPE_READY_ID,
} from "@/constants/scopeIds";

const TodayScreen = () => {
  const insets = useSafeAreaInsets();

  const config = useAppSelector((state) => state.user.config);
  const status = useAppSelector((state) => state.tasks.status);
  const { list, overdue, dueToday, ready, completed, total } =
    useAppSelector(selectTodayTasks);

  const headerH = insets.top + 44;
  const headerFadeExtra = 12;

  const view = config ? config.screens[TODAY_SCOPE_ID].view : null;

  const groupsById = useMemo<GroupByIdType>(
    () => ({
      [TODAY_SCOPE_OVERDUE_ID]: {
        title: "Overdue",
        tasks: overdue,
      },
      [TODAY_SCOPE_DUE_TODAY_ID]: {
        title: "Due Today",
        tasks: dueToday,
      },
      [TODAY_SCOPE_READY_ID]: {
        title: "Ready",
        tasks: ready,
      },
      [TODAY_SCOPE_COMPLETED_ID]: {
        title: "Completed",
        tasks: completed,
      },
    }),
    [overdue, dueToday, ready, completed],
  );

  if (status === "loading") {
    return (
      <ScreenWrapper style={{ justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </ScreenWrapper>
    );
  }

  if (status === "succeeded" && !total) {
    return (
      <NoTasksViewWrapper
        title="Today is clear"
        subtitle={`Today shows tasks that are ready now.\nOnly tasks marked as Next appear here.`}
      />
    );
  }

  if (status === "succeeded") {
    return (
      <ScreenWrapper>
        {view === "group" ? (
          <GroupFlatList
            groupsById={groupsById}
            scopeId={TODAY_SCOPE_ID}
            status={status}
          />
        ) : (
          <FlatList
            data={list}
            keyExtractor={(task) => task.id}
            renderItem={({ item }) => <Task task={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: headerH + headerFadeExtra }}
          />
        )}
      </ScreenWrapper>
    );
  }

  return null;
};

export default TodayScreen;
