import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { fetchAllTasks } from "@/store/actions/tasks.actions";
import { routes } from "@/lib/routes";
import { type Task } from "@/db";
import ScreenContainer from "@/components/custom/ScreenContainer";

type RenderTaskItem = {
  item: Task;
};

// TODO: create a file where you set all possible routes so you can use them as variables across the app, instead of hardcoding strings everywhere. This will help avoid typos and make it easier to refactor routes in the future. For example, you can create a file called routes.ts and export constants for each route:

const InboxScreen = () => {
  const insets = useSafeAreaInsets();
  const headerH = insets.top + 44;
  const headerFadeExtra = 12;

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { tasks, loading, error } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchAllTasks());
  }, [dispatch]);

  if (loading)
    return (
      <ScreenContainer>
        <ActivityIndicator />
      </ScreenContainer>
    );
  if (error)
    return (
      <ScreenContainer>
        <Text>{error}</Text>
      </ScreenContainer>
    );

  const onQuickAdd = () => {
    router.push(routes.quickAdd.href);
  };
  const onGoToPlan = () => {
    router.push(routes.plan.href);
  };

  const renderTaskItem = ({ item }: RenderTaskItem) => (
    <TouchableOpacity activeOpacity={0.2} style={styles.inboxTaskCardContainer}>
      <Text numberOfLines={1} style={styles.inboxTaskTitleText}>
        {item.title}
      </Text>
      <Text>Created at: {new Date(item.created_at).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      {tasks && tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTaskItem}
          contentContainerStyle={[
            styles.inboxTaskListContentContainer,
            { paddingTop: headerH + headerFadeExtra },
          ]}
          ItemSeparatorComponent={() => (
            <View style={styles.inboxTaskRowSpacer} />
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
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
      )}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  inboxTaskCardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E6EAF0",
    paddingHorizontal: 22,
    paddingVertical: 18,
    elevation: 1,
  },
  inboxTaskTitleText: {
    fontSize: 16,
    fontWeight: "600",
    color: "black",
    letterSpacing: 0.2,
  },
  inboxTaskListContentContainer: {
    padding: 16,
  },
  inboxTaskRowSpacer: {
    height: 14,
  },
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
