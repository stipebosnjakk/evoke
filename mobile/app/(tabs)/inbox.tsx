import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { routes } from "@/utils/routes";
import ScreenContainer from "@/components/custom/ScreenContainer";
import { changeContainerId } from "@/store/tasks/tasks.slice";
import { INBOX_CONTAINER_ID } from "@/utils/containerIds";
import { TaskWithOrderKey } from "@/types/task.types";
import { getInboxTasksAction } from "@/store/tasks/thunks/fetch.thunks";
import DraggableTaskList from "@/components/tasks/DraggableTaskList";

const InboxScreen = () => {
  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.tasks.lists.inbox.loading);
  const error = useAppSelector((state) => state.tasks.lists.inbox.error);
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

  useEffect(() => {
    if (!error) return;
    Toast.show({
      type: "error",
      text1: "Couldn't load inbox",
      text2: error ?? "Try again later",
    });
  }, [error]);

  if (loading || (ids.length > 0 && data.length === 0)) {
    return (
      <ScreenContainer
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator />
      </ScreenContainer>
    );
  }

  if (!loading && !data.length && !error) {
    return (
      <ScreenContainer>
        <NoTasksView />
      </ScreenContainer>
    );
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

const NoTasksView = () => {
  const router = useRouter();

  const onQuickAdd = () => {
    router.push(routes.quickAdd.href);
  };
  const onGoToPlan = () => {
    router.push(routes.plan.href);
  };
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.titleText}>Your inbox is clear</Text>
      <Text style={styles.subtitleText}>
        Inbox holds unprocessed tasks.{"\n"}Capture tasks here and organize
        {"\n"}them later.
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onQuickAdd}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Quick Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onGoToPlan}
          style={styles.secondaryButton}
        >
          <Text style={styles.secondaryButtonText}>Go to Plan</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitleText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: "#7B8798",
    textAlign: "center",
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 28,
    alignItems: "center",
    gap: 14,
  },
  primaryButton: {
    width: "86%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0,0,0,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  secondaryButton: {
    width: "86%",
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(0,0,0,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
});

export default InboxScreen;
