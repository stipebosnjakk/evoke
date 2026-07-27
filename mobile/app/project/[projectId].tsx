import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import { useAppSelector } from "@/hooks/storeHooks";
import { selectProjectTasks } from "@/store/selectors/task.selector";
import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import DraggableTaskList from "@/components/group/DraggableTaskList";
import CustomButton from "@/components/ui/CustomButton";
import HeaderWrapper from "@/components/wrappers/HeaderWrapper";
import NoProjectTasksView from "@/components/projects/NoProjectTaskView";
import { routes } from "@/constants/routes";

type LocalSearchParamsType = {
  projectId: string;
};

const ProjectTasksScreen = () => {
  const router = useRouter();

  const status = useAppSelector((state) => state.projects.status);
  const { projectId } = useLocalSearchParams<LocalSearchParamsType>();

  const { data, name } = useAppSelector((state) =>
    selectProjectTasks(state, projectId),
  );

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(routes.projects.href);
    }
  };

  return (
    <ScreenWrapper>
      <HeaderWrapper>
        <View style={styles.side}>
          <CustomButton onPress={handleGoBack}>
            <SymbolView
              name="chevron.left"
              size={23}
              type="monochrome"
              tintColor="#111827"
            />
          </CustomButton>
        </View>
        <View style={styles.center} pointerEvents="none">
          <Text style={styles.title} numberOfLines={1}>
            {name}
          </Text>
        </View>
        <View style={styles.sidePlaceholder} />
      </HeaderWrapper>
      {!data.length && status === "succeeded" ? (
        <NoProjectTasksView projectId={projectId} projectName={name} />
      ) : (
        <DraggableTaskList
          data={data}
          scopeId={projectId}
          isLoading={status === "loading"}
        />
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  side: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#F2F2F2",
  },
  sidePlaceholder: {
    width: 44,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
});

export default ProjectTasksScreen;
