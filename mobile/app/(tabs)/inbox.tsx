import { ActivityIndicator, FlatList } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppSelector } from "@/hooks/storeHooks";
import NoTasksView from "@/components/task/NoTasksView";
import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import DraggableTaskList from "@/components/group/DraggableTaskList";
import { selectInboxTasks } from "@/store/selectors/task.selector";
import {
  INBOX_SCOPE_ACTIVE_ID,
  INBOX_SCOPE_COMPLETED_ID,
  INBOX_SCOPE_ID,
} from "@/constants/scopeIds";
import ErrorView from "@/components/ui/ErrorView";
import Task from "@/components/task/Task";

const InboxScreen = () => {
  const insets = useSafeAreaInsets();

  const config = useAppSelector((state) => state.user.config);
  const status = useAppSelector((state) => state.tasks.status);
  const groups = useAppSelector(selectInboxTasks);

  const view = config ? config.screens[INBOX_SCOPE_ID].view : null;
  const selectedGroup =
    view === "completed"
      ? groups[INBOX_SCOPE_COMPLETED_ID]
      : groups[INBOX_SCOPE_ACTIVE_ID];
  const total = selectedGroup.data.length;

  const headerFadeExtra = 12;
  const headerH = insets.top + 44;

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
        title={view === "completed" ? "No completed tasks" : "Inbox is clear"}
        subtitle={
          view === "completed"
            ? "You don't have any completed tasks in your Inbox."
            : "No tasks are waiting in your Inbox."
        }
      />
    );
  }

  if (status === "failed") {
    return <ErrorView />;
  }

  if (status === "succeeded") {
    return (
      <ScreenWrapper>
        {view === "inbox" ? (
          <DraggableTaskList
            data={selectedGroup.data}
            scopeId={INBOX_SCOPE_ID}
          />
        ) : (
          <FlatList
            data={selectedGroup.data}
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

export default InboxScreen;
