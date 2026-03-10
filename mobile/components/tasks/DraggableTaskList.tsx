import { useCallback } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DraggableFlatList, {
  DragEndParams,
} from "react-native-draggable-flatlist";

import {
  rebalanceOrderKeysAction,
  updateTaskOrderKeyAction,
} from "@/store/tasks/thunks/reorder.thunks";
import {
  calculateNewOrderKey,
  checkForRebalance,
  handleRebalance,
} from "@/utils/rebalance";
import { TaskWithOrderKey } from "@/types/task.types";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { getInboxTasksAction } from "@/store/tasks/thunks/fetch.thunks";
import { INBOX_CONTAINER_ID } from "@/consts/containerIds";
import DraggableTask, { type RenderTaskItem } from "./DraggableTask";
import ScreenContainer from "@/components/custom/ScreenContainer";

type DraggableTaskListProps = {
  data: TaskWithOrderKey[];
  setData: (next: TaskWithOrderKey[]) => void;
  loading: boolean;
  limit: number;
};

const ORDER_KEY_GAP = 1000;

const DraggableTaskList = ({
  data,
  setData,
  loading,
  limit,
}: DraggableTaskListProps) => {
  const dispatch = useAppDispatch();

  const insets = useSafeAreaInsets();
  const headerH = insets.top + 44;
  const headerFadeExtra = 12;

  // TODO: make univerzal for all lists
  const hasMore = useAppSelector((state) => state.tasks.lists.inbox.hasMore);
  const offset = useAppSelector((state) => state.tasks.lists.inbox.offset);

  const renderItem = useCallback(({ item, drag }: RenderTaskItem) => {
    return <DraggableTask item={item} drag={drag} />;
  }, []);

  const loadMore = () => {
    if (loading || !hasMore) return;
    dispatch(getInboxTasksAction({ limit, offset }));
  };

  const ListFooterComponent = (
    <View style={{ height: 16 + insets.bottom }}>
      {loading ? <ActivityIndicator size="small" /> : null}
    </View>
  );

  const handleOnDragEnd = ({
    data: newData,
    from,
    to,
  }: DragEndParams<TaskWithOrderKey>) => {
    if (from === to) return;

    const moved = newData[to];
    const top = newData[to - 1] || null;
    const bottom = newData[to + 1] || null;

    if (!moved) return;

    if (checkForRebalance(top, bottom)) {
      const { newTopOrderKey, newBottomOrderKey } = handleRebalance(
        newData,
        to,
        ORDER_KEY_GAP,
      );

      const movedKey = (newTopOrderKey + newBottomOrderKey) / 2;

      newData[to - 1].order_key = newTopOrderKey;
      newData[to].order_key = movedKey;
      newData[to + 1].order_key = newBottomOrderKey;

      setData([...newData]);

      dispatch(
        rebalanceOrderKeysAction({
          orderArray: [
            { id: top.id, order_key: newTopOrderKey },
            { id: moved.id, order_key: movedKey },
            { id: bottom.id, order_key: newBottomOrderKey },
          ],
          containerId: INBOX_CONTAINER_ID,
        }),
      );

      return;
    }

    setData([...newData]);

    const newOrderKey = calculateNewOrderKey(top, bottom, moved, ORDER_KEY_GAP);

    dispatch(
      updateTaskOrderKeyAction({
        taskId: moved.id,
        containerId: INBOX_CONTAINER_ID,
        newOrderKey,
      }),
    );
  };

  return (
    <ScreenContainer>
      <DraggableFlatList
        data={data}
        keyExtractor={(task) => task.id}
        activationDistance={12}
        contentContainerStyle={[
          styles.inboxTaskListContentContainer,
          { paddingTop: headerH + headerFadeExtra },
        ]}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={ListFooterComponent}
        onDragEnd={handleOnDragEnd}
        renderItem={renderItem}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  inboxTaskListContentContainer: {
    padding: 16,
  },
});

export default DraggableTaskList;
