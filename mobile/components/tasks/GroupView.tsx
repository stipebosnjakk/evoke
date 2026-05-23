import { useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Pressable,
  FlatList,
  ListRenderItem,
} from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ScopeScreenId } from "@/types/scope.types";
import { useAppDispatch } from "@/hooks/storeHooks";
import { updateIsOpenGroupAction } from "@/store/thunks/config.thunks";
import { ResolvedGroupConfig } from "@/types/group.types";
import { Project, Task as TaskDBType } from "@/db";

type GroupViewType = {
  scopeId: ScopeScreenId;
  group: ResolvedGroupConfig<TaskDBType | Project>;
  isDraggingGroup: boolean;
  onDragStart: () => void;
  renderItem: ListRenderItem<any>;
};

const LIMIT_PER_GROUP = 3;
const entering = FadeIn.duration(140).delay(40);
const exiting = FadeOut.duration(90);
const layout = LinearTransition.duration(240).easing(Easing.out(Easing.cubic));

const GroupView = ({
  scopeId,
  group,
  onDragStart,
  isDraggingGroup,
  renderItem,
}: GroupViewType) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const data = group.data.slice(0, LIMIT_PER_GROUP);
  const viewMore = group.data.length - LIMIT_PER_GROUP;

  const showData = group.isOpen && !isDraggingGroup;

  const toggleIsOpen = () => {
    dispatch(
      updateIsOpenGroupAction({
        scopeId,
        groupId: group.id,
        isOpen: !group.isOpen,
      }),
    );
  };

  const navigateToGroupView = () => {
    router.push({
      pathname: "/group/[groupId]",
      params: { groupId: group.id, scopeId },
    });
  };

  const arrowRotation = useSharedValue(showData ? 90 : 0);
  const arrowStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${arrowRotation.value}deg` }],
  }));

  useEffect(() => {
    arrowRotation.value = withTiming(showData ? 90 : 0, { duration: 160 });
  }, [showData, arrowRotation]);

  if (group.data.length === 0) return null;

  return (
    <Animated.View
      style={[styles.groupContainer, { opacity: isDraggingGroup ? 0.5 : 1 }]}
      layout={layout}
    >
      <View style={styles.groupHeaderContainer}>
        <Pressable onPress={navigateToGroupView} style={styles.sidesHeader}>
          <Text style={styles.title}>{group.title}</Text>
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>{group.data.length}</Text>
          </View>
          <SymbolView name="chevron.right" size={13} tintColor="#B7ADA1" />
        </Pressable>
        <View style={styles.sidesHeader}>
          <Pressable
            style={styles.groupButtons}
            onLongPress={onDragStart}
            delayLongPress={200}
          >
            <SymbolView
              name="line.3.horizontal"
              size={26}
              tintColor="#8A8176"
            />
          </Pressable>
          <Pressable style={styles.groupButtons} onPress={toggleIsOpen}>
            <Animated.View style={arrowStyle}>
              <SymbolView name="chevron.right" size={15} tintColor="#B7ADA1" />
            </Animated.View>
          </Pressable>
        </View>
      </View>
      {showData && (
        <Animated.View
          style={styles.tasksContainer}
          entering={entering}
          exiting={exiting}
          layout={layout}
          collapsable={false}
        >
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
          />
          {viewMore > 0 && (
            <TouchableOpacity
              style={styles.viewMoreContainer}
              onPress={navigateToGroupView}
            >
              <Text style={styles.viewMoreText}>View {viewMore} more</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  groupContainer: {
    marginBottom: 20,
  },
  groupHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sidesHeader: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 17,
    lineHeight: 20,
    color: "#1F2937",
    fontWeight: "500",
    letterSpacing: 0,
  },
  totalContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#efefef",
    justifyContent: "center",
    alignItems: "center",
  },
  totalText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
    color: "#555",
  },
  groupButtons: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  tasksContainer: {
    marginTop: 20,
  },
  viewMoreContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  viewMoreText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
    color: "#5F5F59",
    letterSpacing: -0.1,
  },
});

export default GroupView;
