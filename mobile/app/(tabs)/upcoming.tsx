import { ActivityIndicator, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppSelector } from "@/hooks/storeHooks";
import { selectUpcomingTasks } from "@/store/selectors/task.selector";
import { UPCOMING_SCOPE_ID } from "@/constants/scopeIds";
import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import NoTasksViewWrapper from "@/components/tasks/NoTasksViewWrapper";
import GroupFlatList from "@/components/tasks/GroupFlatList";
import Task from "@/components/tasks/Task";

const UpcomingScreen = () => {
  const insets = useSafeAreaInsets();

  const status = useAppSelector((state) => state.tasks.status);
  const config = useAppSelector((state) => state.user.config);
  const { groupsById, list, total } = useAppSelector(selectUpcomingTasks);

  const headerH = insets.top + 44;
  const headerFadeExtra = 12;

  const view = config ? config.screens[UPCOMING_SCOPE_ID].view : null;

  // TODO: check for status and errors for selectors

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
        isUpcoming={true}
        title="Upcoming is clear"
        subtitle={`Upcoming shows tasks planned for later.\nWaiting and Someday tasks also appear here.`}
      />
    );
  }

  return (
    <ScreenWrapper>
      {view === "group" ? (
        <GroupFlatList
          groupsById={groupsById}
          scopeId={UPCOMING_SCOPE_ID}
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
};

export default UpcomingScreen;
