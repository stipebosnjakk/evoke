import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { reloadAppAsync } from "expo";
import ScreenWrapper from "@/components/wrappers/ScreenWrapper";

type ErrorViewType = {
  title?: string;
  subtitle?: string;
};

const ErrorView = ({
  title = "Something went wrong",
  subtitle = "The app ran into a problem. Restarting may fix it.",
}: ErrorViewType) => {
  const restartApp = async () => {
    await reloadAppAsync("User restarted app from error screen");
  };

  return (
    <ScreenWrapper>
      <View style={styles.emptyContainer}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.subtitleText}>{subtitle}</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={restartApp}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Restart App</Text>
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
});

export default ErrorView;
