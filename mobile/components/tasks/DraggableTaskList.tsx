import { useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DraggableFlatList, {
  DragEndParams,
} from "react-native-draggable-flatlist";

import {
  rebalanceOrderKeysAction,
  updateTaskOrderKeyAction,
} from "@/store/thunks/update.thunks";
import {
  calculateNewOrderKey,
  checkForRebalance,
  handleRebalance,
} from "@/utils/rebalance";
import { TaskWithOrderKey } from "@/types/task.types";
import { useAppDispatch } from "@/hooks/storeHooks";
import DraggableTask, { type RenderDraggableTask } from "./DraggableTask";
import { Status } from "@/types/initialState.types";
import { INBOX_SCOPE_ID } from "@/constants/scopeIds";

// TODO: try to make a draggable wrapper

type DraggableTaskListProps = {
  data: TaskWithOrderKey[];
  status: Status;
};

const ORDER_KEY_GAP = 1000;

const DraggableTaskList = ({ data, status }: DraggableTaskListProps) => {
  const dispatch = useAppDispatch();

  const insets = useSafeAreaInsets();
  const headerH = insets.top + 44;
  const headerFadeExtra = 12;

  const renderItem = useCallback(({ item, drag }: RenderDraggableTask) => {
    return <DraggableTask item={item} drag={drag} />;
  }, []);

  const ListFooterComponent = (
    <View style={{ height: 16 + insets.bottom }}>
      {status === "loading" ? <ActivityIndicator size="small" /> : null}
    </View>
  );

  const handleOnDragEnd = ({
    data,
    from,
    to,
  }: DragEndParams<TaskWithOrderKey>) => {
    if (from === to) return;

    const moved = data[to];
    const top = data[to - 1] || null;
    const bottom = data[to + 1] || null;

    if (!moved) return;

    if (checkForRebalance(top, bottom)) {
      const { newTopOrderKey, newBottomOrderKey } = handleRebalance(
        data,
        to,
        ORDER_KEY_GAP,
      );

      const movedKey = (newTopOrderKey + newBottomOrderKey) / 2;

      dispatch(
        rebalanceOrderKeysAction({
          orderArray: [
            { id: top.task.id, order_key: newTopOrderKey },
            { id: moved.task.id, order_key: movedKey },
            { id: bottom.task.id, order_key: newBottomOrderKey },
          ],
          scopeId: INBOX_SCOPE_ID,
        }),
      );

      return;
    }

    const newOrderKey = calculateNewOrderKey(top, bottom, moved, ORDER_KEY_GAP);
    const newOrder = {
      id: moved.task.id,
      order_key: newOrderKey,
    };

    dispatch(
      updateTaskOrderKeyAction({
        newOrder,
        scopeId: INBOX_SCOPE_ID,
      }),
    );
  };

  return (
    <DraggableFlatList
      data={data}
      keyExtractor={({ task }) => task.id}
      activationDistance={12}
      onEndReachedThreshold={0.2}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={ListFooterComponent}
      onDragEnd={handleOnDragEnd}
      renderItem={renderItem}
      contentContainerStyle={{ paddingTop: headerH + headerFadeExtra }}
    />
  );
};

export default DraggableTaskList;
