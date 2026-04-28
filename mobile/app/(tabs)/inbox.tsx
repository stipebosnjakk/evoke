import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator } from "react-native";

import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { changeContainerId } from "@/store/tasks/slices/tasks.slice";
import { INBOX_CONTAINER_ID } from "@/constants/containerIds";
import { TaskWithOrderKey } from "@/types/task.types";
import { getInboxTasksAction } from "@/store/tasks/thunks/fetch.thunks";
import { NoInboxTasksView } from "@/components/tasks/NoInboxTasksView";
import ScreenContainer from "@/components/custom/ScreenContainer";
import DraggableTaskList from "@/components/tasks/DraggableTaskList";

const InboxScreen = () => {
  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.tasks.lists.inbox.loading);
  const limit = useAppSelector((state) => state.tasks.lists.inbox.limit);
  const ids = useAppSelector((state) => state.tasks.lists.inbox.ids);
  const byId = useAppSelector((state) => state.tasks.tasks.byId);

  const inboxTasks = useMemo(
    () =>
      ids
        .map(({ id, order_key }) => {
          const task = byId[id];
          return task ? { ...task, order_key } : null;
        })
        .filter((task): task is TaskWithOrderKey => Boolean(task)),
    [ids, byId],
  );

  const [data, setData] = useState<TaskWithOrderKey[]>([]);

  useEffect(() => {
    setData(inboxTasks);
  }, [inboxTasks]);

  useEffect(() => {
    dispatch(changeContainerId({ containerId: INBOX_CONTAINER_ID }));
    dispatch(getInboxTasksAction({ limit, offset: 0 }));
  }, [dispatch, limit]);

  if (loading || (ids.length > 0 && data.length === 0)) {
    return (
      <ScreenContainer
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator />
      </ScreenContainer>
    );
  }

  if (!loading && !data.length) {
    return <NoInboxTasksView />;
  }

  return (
    <ScreenContainer>
      <DraggableTaskList
        data={data}
        setData={setData}
        loading={loading}
        limit={limit}
      />
    </ScreenContainer>
  );
};

export default InboxScreen;
