import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import Project from "@/components/projects/Project";
import { routes } from "@/constants/routes";
import NoProjects from "@/components/projects/NoProjects";

const ProjectsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const projectLength = 0;

  const headerH = insets.top + 44;
  const headerFadeExtra = 12;

  const navigateToCreateProject = () => {
    router.push(routes.create_project.href);
  };

  if (projectLength === 0) return <NoProjects />;

  return (
    <ScreenWrapper>
      <View style={{ paddingTop: headerH + headerFadeExtra }}>
        <TouchableOpacity
          onPress={navigateToCreateProject}
          style={styles.createButton}
        >
          <SymbolView
            name="plus"
            size={18}
            type="monochrome"
            tintColor="#3F3F46"
          />
          <Text style={styles.createButtonText}>Add Project</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.projectsContainer}>
        <Project />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 34,
    gap: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#efefef",
  },
  createButtonText: {
    color: "#3F3F46",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  projectsContainer: {
    marginTop: 30,
    flexDirection: "column",
    gap: 20,
  },
});

export default ProjectsScreen;
