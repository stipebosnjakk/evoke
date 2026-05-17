import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import { routes } from "@/constants/routes";

const NoProjects = () => {
  const router = useRouter();

  const navigateToCreateProject = () => {
    router.push(routes.create_project.href);
  };
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={styles.titleText}>No project yet</Text>
        <Text style={styles.subtitleText}>
          Create your first project to organize related tasks in one place.
        </Text>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={navigateToCreateProject}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Create a Project</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 14,
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

export default NoProjects;
