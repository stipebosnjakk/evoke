import { ActivityIndicator, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppSelector } from "@/hooks/storeHooks";
import { selectUpcomingTasks } from "@/store/selectors/task.selector";
import { UPCOMING_SCOPE_ID, VIEW_OPTIONS } from "@/constants/scopeIds";
import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import NoTasksView from "@/components/task/NoTasksView";
import GroupFlatList from "@/components/group/GroupFlatList";
import Task from "@/components/task/Task";
import ErrorView from "@/components/custom/ErrorView";
import { getUpcomingTaskDate } from "@/utils/taskPlacement";

const UpcomingScreen = () => {
  const insets = useSafeAreaInsets();

  const status = useAppSelector((state) => state.tasks.status);
  const config = useAppSelector((state) => state.user.config);
  const { groupsById, list, total } = useAppSelector(selectUpcomingTasks);

  const headerH = insets.top + 44;
  const headerFadeExtra = 12;

  const view = config ? config.screens[UPCOMING_SCOPE_ID].view : null;

  if (status === "loading") {
    return (
      <ScreenWrapper style={{ justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </ScreenWrapper>
    );
  }

  if (status === "succeeded" && !total) {
    return (
      <NoTasksView
        isUpcoming={true}
        title="Upcoming is clear"
        subtitle={`Upcoming shows tasks planned for later.\nWaiting and Someday tasks also appear here.`}
      />
    );
  }

  if (status === "failed") {
    return <ErrorView />;
  }

  return (
    <ScreenWrapper>
      {view === VIEW_OPTIONS.group.view ? (
        <GroupFlatList
          groupsById={groupsById}
          scopeId={UPCOMING_SCOPE_ID}
          status={status}
          renderItem={({ item }) => (
            <Task
              task={item}
              isPreview={
                Boolean(item.repeat?.length) &&
                getUpcomingTaskDate(item) !== null
              }
            />
          )}
        />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(task) => task.id}
          renderItem={({ item }) => (
            <Task
              task={item}
              isPreview={
                Boolean(item.repeat?.length) &&
                getUpcomingTaskDate(item) !== null
              }
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: headerH + headerFadeExtra }}
        />
      )}
    </ScreenWrapper>
  );
};

export default UpcomingScreen;
