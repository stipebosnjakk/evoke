import { ActivityIndicator } from "react-native";

import { useAppSelector } from "@/hooks/storeHooks";
import { NoInboxTasksView } from "@/components/tasks/NoInboxTasksView";
import ScreenContainer from "@/components/custom/ScreenContainer";
import DraggableTaskList from "@/components/tasks/DraggableTaskList";
import { selectInboxTasks } from "@/store/tasks/selectors/inbox.selector";

const InboxScreen = () => {
  const status = useAppSelector((state) => state.tasks.status);
  const data = useAppSelector(selectInboxTasks);

  if (status === "loading") {
    return (
      <ScreenContainer
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator />
      </ScreenContainer>
    );
  }

  if (status === "succeeded" && !data.length) {
    return <NoInboxTasksView />;
  }

  if (status === "succeeded") {
    return (
      <ScreenContainer>
        <DraggableTaskList data={data} status={status} />
      </ScreenContainer>
    );
  }
};

export default InboxScreen;
