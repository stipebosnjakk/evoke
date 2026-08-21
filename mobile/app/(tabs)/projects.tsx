import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SymbolView } from "expo-symbols";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";

import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import Project from "@/components/projects/Project";
import GroupFlatList from "@/components/group/GroupFlatList";
import ErrorView from "@/components/ui/ErrorView";
import NoProjectsView from "@/components/projects/NoProjectsView";
import { routes } from "@/constants/routes";
import { useAppSelector } from "@/hooks/storeHooks";
import { selectProjects } from "@/store/selectors/projects.selector";
import { PROJECTS_SCOPE_ID } from "@/constants/scopeIds";

const BUTTON_HEIGHT = 44;
const BUTTON_GAP = 10;

const ProjectsScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const config = useAppSelector((state) => state.user.config);
  const status = useAppSelector((state) => state.projects.status);
  const { groupsById, list, total } = useAppSelector(selectProjects);

  const view = config?.screens[PROJECTS_SCOPE_ID].view;

  const paddingTop = insets.top + 44 + 12;
  const paddingBottom = BUTTON_HEIGHT + BUTTON_GAP;

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
    return <NoProjectsView />;
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {view === "group" ? (
          <GroupFlatList
            groupsById={groupsById}
            scopeId={PROJECTS_SCOPE_ID}
            status={status}
            renderItem={({ item }) => <Project project={item} />}
            style={{
              paddingTop,
              paddingBottom,
            }}
          />
        ) : (
          <FlatList
            data={list}
            keyExtractor={(project) => project.id}
            renderItem={({ item }) => <Project project={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop,
              paddingBottom,
            }}
          />
        )}
        <View style={[styles.createButtonContainer, { bottom: BUTTON_GAP }]}>
          <View style={styles.createButtonShadow}>
            <BlurView intensity={20} tint="light" style={styles.createButton}>
              <TouchableOpacity
                onPress={navigateToCreateProject}
                style={styles.createButtonInner}
              >
                <SymbolView
                  name="plus"
                  size={18}
                  type="monochrome"
                  tintColor="#3F3F46"
                />
                <Text style={styles.createButtonText}>Add Project</Text>
              </TouchableOpacity>
            </BlurView>
          </View>
        </View>
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
  createButtonContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  createButtonShadow: {
    height: BUTTON_HEIGHT,
    borderRadius: 34,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  createButton: {
    flex: 1,
    borderRadius: 34,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  createButtonInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    gap: 20,
  },
  createButtonText: {
    color: "#3F3F46",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});

export default ProjectsScreen;
