import { useCallback, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DraggableFlatList, {
  DragEndParams,
} from "react-native-draggable-flatlist";
import {
  ActivityIndicator,
  View,
  ListRenderItem,
  ViewStyle,
  StyleProp,
} from "react-native";

import GroupView from "@/components/group/GroupView";
import { Project, Task } from "@/db";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { updateGroupOrderAction } from "@/store/thunks/config.thunks";
import { ScopeScreenId } from "@/types/scope.types";
import { GroupByIdType, ResolvedGroupConfig } from "@/types/group.types";
import { Status } from "@/types/initialState.types";

type RenderDraggableGroup = {
  item: ResolvedGroupConfig<any>;
  drag: () => void;
};

type GroupFlatListType = {
  groupsById: GroupByIdType<string>;
  scopeId: ScopeScreenId;
  status: Status;
  renderItem: ListRenderItem<any>;
  style?: StyleProp<ViewStyle>;
};

const GroupFlatList = ({
  groupsById,
  scopeId,
  status,
  renderItem,
  style,
}: GroupFlatListType) => {
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
            data: groupData.data,
          },
        ];
      })
      .sort((a, b) => b.order_key - a.order_key);
  }, [config, groupsById, scopeId]);

  const handleOnDragEnd = ({
    data,
    from,
    to,
  }: DragEndParams<ResolvedGroupConfig<Task | Project>>) => {
    setIsDraggingGroup(false);

    if (from === to) return;

    const groupConfig = data.map(({ id, isOpen }, index) => ({
      id,
      isOpen,
      order_key: data.length - index,
    }));

    dispatch(updateGroupOrderAction({ scopeId, groupConfig }));
  };

  const handleOnDragStart = useCallback((drag: () => void) => {
    setIsDraggingGroup(true);
    requestAnimationFrame(() => {
      drag();
    });
  }, []);

  const renderGroup = useCallback(
    ({ item, drag }: RenderDraggableGroup) => {
      return (
        <GroupView
          scopeId={scopeId}
          group={item}
          onDragStart={() => handleOnDragStart(drag)}
          isDraggingGroup={isDraggingGroup}
          renderItem={renderItem}
        />
      );
    },
    [scopeId, handleOnDragStart, isDraggingGroup, renderItem],
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
      keyExtractor={(group: ResolvedGroupConfig<Task | Project>) => group.id}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={ListFooterComponent}
      renderItem={renderGroup}
      onDragBegin={() => setIsDraggingGroup(true)}
      onDragEnd={handleOnDragEnd}
      contentContainerStyle={[
        {
          paddingTop: headerH + headerFadeExtra,
        },
        style,
      ]}
    />
  );
};

export default GroupFlatList;
