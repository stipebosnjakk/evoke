import { useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DraggableFlatList, {
  DragEndParams,
} from "react-native-draggable-flatlist";

import { updateOrderKeysAction } from "@/store/thunks/mutation.thunks";
import {
  calculateNewOrderKey,
  checkForRebalance,
  handleRebalance,
} from "@/utils/rebalance";
import { useAppDispatch } from "@/hooks/storeHooks";
import { TaskWithOrderKey, OrderTaskItem } from "@/types/task.types";
import Task from "@/components/task/Task";

type RenderDraggableTask = {
  item: TaskWithOrderKey;
  drag: () => void;
};

type DraggableTaskListProps = {
  data: TaskWithOrderKey[];
  scopeId: string;
  isLoading?: boolean;
};

const ORDER_KEY_GAP = 1000;

const DraggableTaskList = ({
  data,
  scopeId,
  isLoading,
}: DraggableTaskListProps) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const headerH = insets.top + 44;
  const headerFadeExtra = 12;

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

    let orderArray: OrderTaskItem[];

    if (top && bottom && checkForRebalance(top, bottom)) {
      const { newTopOrderKey, newBottomOrderKey } = handleRebalance(
        data,
        to,
        ORDER_KEY_GAP,
      );

      const movedKey = (newTopOrderKey + newBottomOrderKey) / 2;

      orderArray = [
        { id: top.task.id, order_key: newTopOrderKey },
        { id: moved.task.id, order_key: movedKey },
        { id: bottom.task.id, order_key: newBottomOrderKey },
      ];
    } else {
      orderArray = [
        {
          id: moved.task.id,
          order_key: calculateNewOrderKey(top, bottom, moved, ORDER_KEY_GAP),
        },
      ];
    }

    dispatch(updateOrderKeysAction({ orderArray, scopeId }));
  };

  const renderItem = useCallback(({ item, drag }: RenderDraggableTask) => {
    return <Task task={item.task} onDrag={drag} />;
  }, []);

  const ListFooterComponent = () => {
    return (
      <View style={{ height: 16 + insets.bottom }}>
        {isLoading ? <ActivityIndicator size="small" /> : null}
      </View>
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
