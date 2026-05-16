import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DraggableFlatList, {
  DragEndParams,
} from "react-native-draggable-flatlist";

import GroupView, { GroupType } from "./GroupView";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { updateGroupOrderAction } from "@/store/user/thunks/config.thunks";
import { GroupByIdType, Status } from "@/types/initialState.types";
import { ScopeScreenId } from "@/types/task.types";

type RenderDraggableGroup = {
  item: GroupType;
  drag: () => void;
};

type GroupFlatListType = {
  groupsById: GroupByIdType;
  scopeId: ScopeScreenId;
  status: Status;
};

const GroupFlatList = ({ groupsById, scopeId, status }: GroupFlatListType) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const headerH = insets.top + 44;
  const headerFadeExtra = 12;

  const config = useAppSelector((state) => state.user.config);

  const [isDraggingGroup, setIsDraggingGroup] = useState<boolean>(false);

  const groups = useMemo(() => {
    if (!config) return [];

    return config.screens[scopeId].group_order
      .flatMap((group) => {
        const groupData = groupsById[group.id];

        if (!groupData) return [];

        return [
          {
            ...group,
            title: groupData.title,
            tasks: groupData.tasks,
          },
        ];
      })
      .sort((a: GroupType, b: GroupType) => b.order_key - a.order_key);
  }, [config, groupsById, scopeId]);

  const handleOnDragEnd = ({ data, from, to }: DragEndParams<GroupType>) => {
    setIsDraggingGroup(false);

    if (from === to) return;

    const groupConfig = data.map(({ id, isOpen }, index) => ({
      id,
      isOpen,
      order_key: data.length - index,
    }));

    dispatch(updateGroupOrderAction({ screenId: scopeId, groupConfig }));
  };

  const handleOnDragStart = useCallback((drag: () => void) => {
    setIsDraggingGroup(true);
    requestAnimationFrame(() => {
      drag();
    });
  }, []);

  const renderItem = useCallback(
    ({ item, drag }: RenderDraggableGroup) => {
      return (
        <GroupView
          screenId={scopeId}
          group={item}
          onDragStart={() => handleOnDragStart(drag)}
          isDraggingGroup={isDraggingGroup}
        />
      );
    },
    [scopeId, handleOnDragStart, isDraggingGroup],
  );

  const ListFooterComponent = (
    <View style={{ height: 16 + insets.bottom }}>
      {status === "loading" ? <ActivityIndicator size="small" /> : null}
    </View>
  );

  return (
    <DraggableFlatList
      data={groups}
      activationDistance={12}
      keyExtractor={(group: GroupType) => group.id}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={ListFooterComponent}
      renderItem={renderItem}
      onDragBegin={() => setIsDraggingGroup(true)}
      onDragEnd={handleOnDragEnd}
      contentContainerStyle={{ paddingTop: headerH + headerFadeExtra }}
    />
  );
};

export default GroupFlatList;
