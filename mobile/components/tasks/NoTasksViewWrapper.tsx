import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { routes } from "@/constants/routes";
import ScreenWrapper from "@/components/wrappers/ScreenWrapper";

type NoTasksViewWrapperType = {
  title: string;
  subtitle?: string;
};

const NoTasksViewWrapper = ({ title, subtitle }: NoTasksViewWrapperType) => {
  const router = useRouter();

  const navigateToCreateModal = () => {
    router.push(routes.create_task.href);
  };

  const navigateToUpcoming = () => {
    router.push(routes.upcoming.href);
  };

  return (
    <ScreenWrapper>
      <View style={styles.emptyContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.subtitleText}>{subtitle}</Text>
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
            onPress={navigateToUpcoming}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Go to Upcoming</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
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
    backgroundColor: "#191919",
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
    backgroundColor: "#efefef",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },
});

export default NoTasksViewWrapper;
