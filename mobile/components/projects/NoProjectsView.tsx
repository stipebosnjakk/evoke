import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import { routes } from "@/constants/routes";

const NoProjectsView = () => {
  const router = useRouter();

  const navigateToCreateProject = () => {
    router.push(routes.form_project.href);
  };

  return (
    <ScreenWrapper>
      <View style={styles.noProjectContainer}>
        <Text style={styles.noProjectsTitleText}>No project yet</Text>
        <Text style={styles.noProjectsSubtitleText}>
          Create your first project to organize related tasks in one place.
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={navigateToCreateProject}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Create Project</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  noProjectContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 14,
  },
  noProjectsTitleText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 10,
  },
  noProjectsSubtitleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#7B8798",
    textAlign: "center",
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

export default NoProjectsView;
