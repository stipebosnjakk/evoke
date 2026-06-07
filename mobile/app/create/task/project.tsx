import { useRouter } from "expo-router";
import { FlatList } from "react-native";

import { routes } from "@/constants/routes";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { selectProjects } from "@/store/selectors/projects.selector";
import { ProjectStateData } from "@/types/project.types";
import SheetHeader from "@/components/custom/SheetHeader";
import SheetWrapper from "@/components/wrappers/SheetWrapper";
import ProjectPicker from "@/components/projects/ProjectPicker";
import { useEffect, useState } from "react";
import { setProjectId } from "@/store/slices/newTask.slice";

type RenderItemType = {
  item: ProjectStateData;
};

const ProjectFormSheet = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const projects = useAppSelector((state) => selectProjects(state).list);
  const newProjectId = useAppSelector((state) => state.newTask.task.project_id);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | null | undefined
  >(newProjectId);

  useEffect(() => {
    setSelectedProjectId(newProjectId);
  }, [newProjectId]);

  const handleSubmit = async () => {
    if (selectedProjectId === newProjectId || isSubmitting) return;
    setIsSubmitting(true);

    dispatch(setProjectId({ projectId: selectedProjectId }));

    setIsSubmitting(false);
    router.back();
  };

  const toggleProject = (projectId: string) => {
    setSelectedProjectId((current) =>
      current === projectId ? null : projectId,
    );
  };

  const renderItem = ({ item }: RenderItemType) => (
    <ProjectPicker
      project={item}
      isSelected={selectedProjectId === item.id}
      onPress={() => {
        toggleProject(item.id);
      }}
    />
  );

  //   TODO: fetch only active and archieved projects, add limits to projects, and later on on completed tasks

  return (
    <SheetWrapper>
      <SheetHeader
        title={routes.create_task_project.title}
        onSubmit={handleSubmit}
        submitButtonVisible={true}
        submitDisabled={isSubmitting || selectedProjectId === newProjectId}
      />
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      />
    </SheetWrapper>
  );
};

export default ProjectFormSheet;
