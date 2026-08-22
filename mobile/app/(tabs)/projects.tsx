import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import Project from "@/components/projects/Project";
import ErrorView from "@/components/custom/ErrorView";
import NoProjectsView from "@/components/projects/NoProjectsView";
import { routes } from "@/constants/routes";
import { useAppSelector } from "@/hooks/storeHooks";
import { selectProjects } from "@/store/selectors/projects.selector";
import {
  PROJECTS_SCOPE_ACTIVE_ID,
  PROJECTS_SCOPE_COMPLETED_ID,
  PROJECTS_SCOPE_ID,
  VIEW_OPTIONS,
} from "@/constants/scopeIds";
import NoCompletedProjects from "@/components/projects/NoCompletedProjects";

const ProjectsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const config = useAppSelector((state) => state.user.config);
  const status = useAppSelector((state) => state.projects.status);
  const groups = useAppSelector(selectProjects);

  const view = config?.screens[PROJECTS_SCOPE_ID].view;

  const selectedGroup =
    view === VIEW_OPTIONS.active.view
      ? groups[PROJECTS_SCOPE_ACTIVE_ID]
      : groups[PROJECTS_SCOPE_COMPLETED_ID];

  const total = selectedGroup.data.length;

  const navigateToCreateProject = () => {
    router.push(routes.form_project.href);
  };

  if (status === "loading") {
    return (
      <ScreenWrapper style={styles.center}>
        <ActivityIndicator />
      </ScreenWrapper>
    );
  }

  if (status === "failed") {
    return <ErrorView />;
  }

  if (status === "succeeded" && total === 0) {
    if (view === VIEW_OPTIONS.active.view) {
      return <NoProjectsView />;
    }

    if (view === VIEW_OPTIONS.completed.view) {
      return <NoCompletedProjects />;
    }
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <FlatList
          data={selectedGroup.data}
          keyExtractor={(project) => project.id}
          renderItem={({ item }) => <Project project={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.contentContainer,
            {
              paddingTop: insets.top + 44 + 12,
            },
          ]}
        />
        <TouchableOpacity
          onPress={navigateToCreateProject}
          activeOpacity={0.8}
          style={styles.createButton}
        >
          <SymbolView
            name="plus"
            size={22}
            type="monochrome"
            tintColor="#FFFFFF"
          />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  createButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
});

export default ProjectsScreen;
