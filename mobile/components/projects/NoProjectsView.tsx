import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import { routes } from "@/constants/routes";
import { updateScreenViewAction } from "@/store/thunks/config.thunks";
import { PROJECTS_SCOPE_ID, VIEW_OPTIONS } from "@/constants/scopeIds";
import { useAppDispatch } from "@/hooks/storeHooks";

type NoProjectsViewProps = {
  completed: boolean;
};

const NoProjectsView = ({ completed }: NoProjectsViewProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const navigateToCreateProject = () => {
    router.push(routes.form_project.href);
  };

  const navigateToActiveProjects = () => {
    dispatch(
      updateScreenViewAction({
        scopeId: PROJECTS_SCOPE_ID,
        view: VIEW_OPTIONS.active.view,
      }),
    );
  };

  const onPress = completed
    ? navigateToActiveProjects
    : navigateToCreateProject;

  return (
    <ScreenWrapper>
      <View style={styles.noProjectContainer}>
        <Text style={styles.noProjectsTitleText}>
          {completed ? "No completed projects" : "No projects yet"}
        </Text>

        <Text style={styles.noProjectsSubtitleText}>
          {completed
            ? "You don't have any completed projects yet."
            : "Create your first project to organize related tasks in one place."}
        </Text>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onPress}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>
            {completed ? "View Active Projects" : "Create Project"}
          </Text>
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
