import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import { useAppSelector } from "@/hooks/storeHooks";
import { selectProjectTasks } from "@/store/selectors/task.selector";
import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import DraggableTaskList from "@/components/group/DraggableTaskList";
import Button from "@/components/ui/Button";
import HeaderWrapper from "@/components/custom/HeaderWrapper";

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

  return (
    <ScreenWrapper>
      <HeaderWrapper>
        <HeaderWrapper>
          <View style={styles.side}>
            <Button onPress={() => router.back()}>
              <SymbolView
                name="chevron.left"
                size={23}
                type="monochrome"
                tintColor="#111827"
              />
            </Button>
          </View>
          <View style={styles.center} pointerEvents="none">
            <Text style={styles.title} numberOfLines={1}>
              {name}
            </Text>
          </View>
          <View style={styles.side} />
        </HeaderWrapper>
      </HeaderWrapper>
      <DraggableTaskList
        data={data}
        scopeId={projectId}
        isLoading={status === "loading"}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  side: {
    width: 72,
    alignItems: "flex-start",
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
