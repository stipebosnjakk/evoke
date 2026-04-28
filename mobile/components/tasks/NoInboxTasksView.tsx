import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { routes } from "@/constants/routes";
import ScreenContainer from "@/components/custom/ScreenContainer";

export const NoInboxTasksView = () => {
  const router = useRouter();

  const navigateToCreateModal = () => {
    router.push(routes.create_task.href);
  };

  const navigateToPlan = () => {
    router.push(routes.plan.href);
  };

  return (
    <ScreenContainer>
      <View style={styles.emptyContainer}>
        <Text style={styles.titleText}>Your inbox is clear</Text>
        <Text style={styles.subtitleText}>
          Inbox holds unprocessed tasks.{"\n"}Capture tasks here and organize
          {"\n"}them later.
        </Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={navigateToCreateModal}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Create Task</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={navigateToPlan}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Go to Plan</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
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
