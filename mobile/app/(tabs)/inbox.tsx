import { ActivityIndicator } from "react-native";

import { useAppSelector } from "@/hooks/storeHooks";
import NoTasksView from "@/components/task/NoTasksView";
import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import DraggableTaskList from "@/components/group/DraggableTaskList";
import { selectInboxTasks } from "@/store/selectors/task.selector";
import { INBOX_SCOPE_ID } from "@/constants/scopeIds";
import ErrorView from "@/components/ui/ErrorView";

const InboxScreen = () => {
  const status = useAppSelector((state) => state.tasks.status);
  const data = useAppSelector(selectInboxTasks);

  if (status === "loading") {
    return (
      <ScreenWrapper style={{ justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </ScreenWrapper>
    );
  }

  if (status === "succeeded" && !data.length) {
    return (
      <NoTasksView
        title="Your inbox is clear"
        subtitle={`Inbox holds unprocessed tasks.\nCapture tasks here and organize\nthem later.`}
      />
    );
  }

  if (status === "failed") {
    return <ErrorView />;
  }

  if (status === "succeeded") {
    return (
      <ScreenWrapper>
        <DraggableTaskList data={data} scopeId={INBOX_SCOPE_ID} />
      </ScreenWrapper>
    );
  }

  return null;
};

export default InboxScreen;
