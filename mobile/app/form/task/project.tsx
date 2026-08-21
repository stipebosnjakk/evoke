import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import SheetHeader from "@/components/custom/SheetHeader";
import NoProjectsView from "@/components/projects/NoProjectsView";
import ProjectPicker from "@/components/projects/ProjectPicker";
import SheetWrapper from "@/components/wrappers/SheetWrapper";

import { routes } from "@/constants/routes";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { selectProjects } from "@/store/selectors/projects.selector";
import { selectTaskById } from "@/store/selectors/task.selector";
import { setProjectId } from "@/store/slices/formTask.slice";
import { updateTaskProjectAction } from "@/store/thunks/task/task.crud.thunks";
import { ScopeParams } from "@/types/initialState.types";
import { ProjectStateData } from "@/types/project.types";
import { getErrorMessage } from "@/utils/error";
import { PROJECTS_SCOPE_ACTIVE_ID } from "@/constants/scopeIds";

type RenderItemType = {
  item: ProjectStateData;
};

type LocalSearchParamsType = {
  scope?: ScopeParams;
  taskId?: string;
};

const ProjectFormSheet = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { scope, taskId } = useLocalSearchParams<LocalSearchParamsType>();

  const groups = useAppSelector(selectProjects);
  const projects = groups[PROJECTS_SCOPE_ACTIVE_ID].data;

  const formProjectId = useAppSelector(
    (state) => state.formTask.task.project_id,
  );

  const task = useAppSelector((state) =>
    taskId ? selectTaskById(state, taskId) : null,
  );

  const projectId =
    formProjectId !== undefined ? formProjectId : (task?.project_id ?? null);

  const [selected, setSelected] = useState<string | null>(projectId);

  useEffect(() => {
    setSelected(projectId);
  }, [projectId, taskId]);

  const handleCloseSheet = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(routes.today.href);
  };

  const handleSaveProject = async (nextProjectId: string | null) => {
    if (scope === "field") {
      if (!taskId) {
        throw new Error("Task ID is missing");
      }

      if (!task) {
        throw new Error(`Task "${taskId}" is missing from state`);
      }

      await dispatch(
        updateTaskProjectAction({
          taskId,
          projectId: nextProjectId,
        }),
      ).unwrap();

      return;
    }

    dispatch(
      setProjectId({
        projectId: nextProjectId,
      }),
    );
  };

  const handleNewProjectSelect = (nextProjectId: string) => {
    setSelected((current) =>
      current === nextProjectId ? null : nextProjectId,
    );
  };

  const handleSubmitProject = async () => {
    try {
      await handleSaveProject(selected);
      handleCloseSheet();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Unable to Save Project",
        text2: getErrorMessage(error, "Failed to update task project"),
      });
    }
  };

  const renderItem = ({ item }: RenderItemType) => (
    <ProjectPicker
      project={item}
      isSelected={selected === item.id}
      onPress={() => handleNewProjectSelect(item.id)}
    />
  );

  const isProjectUnchanged = selected === projectId;
  const hasInvalidTask = !taskId || !task;

  const submitDisabled =
    scope === "field"
      ? hasInvalidTask || isProjectUnchanged
      : isProjectUnchanged;

  return (
    <SheetWrapper>
      <SheetHeader
        title={routes.form_task_project.title}
        onClose={handleCloseSheet}
        onSubmit={handleSubmitProject}
        submitButtonVisible={projects.length > 0}
        submitDisabled={submitDisabled}
      />
      {projects.length > 0 ? (
        <FlatList
          data={projects}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16 }}
        />
      ) : (
        <NoProjectsView completed={false} />
      )}
    </SheetWrapper>
  );
};

export default ProjectFormSheet;
