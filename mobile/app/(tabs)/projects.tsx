import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import Project from "@/components/projects/Project";
import { routes } from "@/constants/routes";
import { useAppSelector } from "@/hooks/storeHooks";
import { selectProjects } from "@/store/selectors/projects.selector";
import { PROJECTS_SCOPE_ID } from "@/constants/scopeIds";
import GroupFlatList from "@/components/group/GroupFlatList";
import ErrorView from "@/components/ui/ErrorView";

const ProjectsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const config = useAppSelector((state) => state.user.config);
  const status = useAppSelector((state) => state.projects.status);
  const { groupsById, list, total } = useAppSelector(selectProjects);

  const view = config ? config.screens[PROJECTS_SCOPE_ID].view : null;

  const headerH = insets.top + 44;
  const headerFadeExtra = 12;
  const createButtonHeight = 44;
  const gap = 12;
  const paddingTop = headerH + headerFadeExtra + createButtonHeight + gap;

  const navigateToCreateProject = () => {
    router.push(routes.form_project.href);
  };

  if (status === "loading") {
    return (
      <ScreenWrapper style={{ justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </ScreenWrapper>
    );
  }

  if (status === "failed") {
    return <ErrorView />;
  }

  if (status === "succeeded" && total === 0) {
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
  }

  return (
    <ScreenWrapper style={styles.screenContainer}>
      <View
        style={[
          styles.createProjectContainer,
          { top: headerH + headerFadeExtra },
        ]}
      >
        <Pressable
          onPress={navigateToCreateProject}
          style={[styles.createButton, { height: createButtonHeight }]}
        >
          <SymbolView
            name="plus"
            size={18}
            type="monochrome"
            tintColor="#3F3F46"
          />
          <Text style={styles.createButtonText}>Add Project</Text>
        </Pressable>
      </View>
      {view === "group" ? (
        <GroupFlatList
          groupsById={groupsById}
          scopeId={PROJECTS_SCOPE_ID}
          status={status}
          renderItem={({ item }) => <Project project={item} />}
          style={{ paddingTop }}
        />
      ) : (
        <FlatList
          data={list}
          keyExtractor={(project) => project.id}
          renderItem={({ item }) => <Project project={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop,
          }}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    position: "relative",
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
  createProjectContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 24,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 22,
    borderRadius: 34,
    gap: 20,
    borderWidth: 1,
    borderColor: "#efefef",
    zIndex: 1,
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

export default ProjectsScreen;
