import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SymbolView } from "expo-symbols";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import SheetWrapper from "@/components/wrappers/SheetWrapper";
import SheetHeader from "@/components/custom/SheetHeader";
import { routes } from "@/constants/routes";
import { getErrorMessage } from "@/utils/error";
import { projectColors } from "@/constants/colors";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import {
  createProjectAction,
  updateProjectAction,
} from "@/store/thunks/project/project.crud.thunks";
import {
  clearProjectState,
  setName,
  validateNameAndColor,
} from "@/store/slices/formProject.slice";
import { ModeParams } from "@/types/initialState.types";
import { updateScreenViewAction } from "@/store/thunks/config.thunks";
import { PROJECTS_SCOPE_ID, VIEW_OPTIONS } from "@/constants/scopeIds";

type LocalSearchParamsType = {
  mode?: ModeParams;
  projectId?: string;
};

const FormProjectFormSheet = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.formProject.loading);
  const formProject = useAppSelector((state) => state.formProject.project);

  const selectedColor = projectColors.find(
    (item) => item.hex === formProject.color,
  );

  const { mode, projectId } = useLocalSearchParams<LocalSearchParamsType>();

  const navigateToColor = () => {
    router.push(routes.form_project_color.href);
  };

  const handleNavigation = (id?: string) => {
    Toast.hide();

    if (!id) {
      router.dismissTo(routes.projects.href);
      return;
    }

    router.dismissTo({
      pathname: routes.single_project.href,
      params: {
        projectId: id,
      },
    } as any);
  };

  const handleSubmitFunction = async () => {
    if (loading) return;

    try {
      await dispatch(validateNameAndColor());

      const result =
        mode === "edit"
          ? await dispatch(updateProjectAction(projectId)).unwrap()
          : await dispatch(createProjectAction()).unwrap();

      const project = result.project;

      dispatch(clearProjectState());

      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace(routes.projects.href);
      }

      if (mode !== "edit") {
        dispatch(
          updateScreenViewAction({
            scopeId: PROJECTS_SCOPE_ID,
            view: VIEW_OPTIONS.active.view,
          }),
        );
      }

      Toast.show({
        type: "info",
        text1: project.name,
        text2: mode === "edit" ? "Project updated" : "Project created",
        props: {
          icon: "chevron.right",
          onPress: () => handleNavigation(project.id),
        },
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1:
          mode === "edit"
            ? "Failed to update project"
            : "Failed to create a project",
        text2: getErrorMessage(error, "Something went wrong."),
      });
    }
  };

  return (
    <SheetWrapper toastEnabled={false}>
      <SheetHeader
        title="Create a project"
        submitButtonVisible
        submitDisabled={!formProject.name.trim() || loading}
        onSubmit={handleSubmitFunction}
      />
      <View style={styles.nameContainer}>
        <TextInput
          autoFocus
          value={formProject.name}
          style={styles.nameInput}
          placeholder="Name"
          placeholderTextColor="#A1A1AA"
          returnKeyType="next"
          blurOnSubmit={false}
          keyboardType="default"
          onChangeText={(text) => {
            dispatch(setName({ name: text }));
          }}
        />
      </View>
      <TouchableOpacity
        onPress={navigateToColor}
        style={styles.colorContainer}
        activeOpacity={0.75}
      >
        <View style={styles.leftSideColorContainer}>
          <View style={styles.iconContainer}>
            <SymbolView
              name="paintpalette"
              size={18}
              type="monochrome"
              tintColor="#71717A"
            />
          </View>
          <Text style={styles.leftSideColorText}>Color</Text>
        </View>
        <View style={styles.rightSideColorContainer}>
          <Text style={styles.rightSideColorText}>
            {selectedColor?.name || projectColors[0]?.name}
          </Text>
          <View
            style={[
              styles.colorElement,
              { backgroundColor: selectedColor?.hex || projectColors[0]?.hex },
            ]}
          />
          <SymbolView
            name="chevron.right"
            size={12}
            type="monochrome"
            tintColor="#A1A1AA"
          />
        </View>
      </TouchableOpacity>
    </SheetWrapper>
  );
};

const styles = StyleSheet.create({
  nameContainer: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },
  nameInput: {
    color: "#18181B",
    fontSize: 18,
    fontWeight: "500",
    paddingVertical: 4,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
  },
  colorContainer: {
    marginHorizontal: 12,
    marginTop: 10,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSideColorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F4F4F5",
    alignItems: "center",
    justifyContent: "center",
  },
  leftSideColorText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#27272A",
  },
  rightSideColorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  rightSideColorText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#71717A",
  },
  colorElement: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
});

export default FormProjectFormSheet;
