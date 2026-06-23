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
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { setName } from "@/store/slices/newProject.slice";
import { getErrorMessage } from "@/utils/error";
import { createProjectAction } from "@/store/thunks/create.thunks";
import { projectColors } from "@/constants/colors";
import { updateProjectAction } from "@/store/thunks/update.thunks";

type LocalSearchParamsType = {
  mode?: "create" | "edit";
  projectId?: string;
};

const CreateProjectFormSheet = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const loading = useAppSelector((state) => state.newProject.loading);
  const name = useAppSelector((state) => state.newProject.project.name);
  const color = useAppSelector((state) => state.newProject.project.color);

  const selectedColor = projectColors.find((item) => item.hex === color);

  const { mode, projectId } = useLocalSearchParams<LocalSearchParamsType>();

  // TODO: clear state

  // useEffect(() => {
  //   return () => {
  //     dispatch(clearProjectState());
  //   };
  // }, [dispatch]);

  const handleSubmitFunction = async () => {
    if (loading) return;

    try {
      if (mode === "edit") {
        if (!projectId) {
          throw new Error("Project ID is required");
        }

        await dispatch(updateProjectAction(projectId)).unwrap();
        return;
      }

      await dispatch(createProjectAction()).unwrap();
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

  const navigateToColor = () => {
    router.push(routes.form_project_color.href);
  };

  return (
    <SheetWrapper>
      <SheetHeader
        title="Create a project"
        submitButtonVisible
        submitDisabled={!name.trim() || loading}
        onSubmit={handleSubmitFunction}
      />
      <View style={styles.nameContainer}>
        <TextInput
          autoFocus
          value={name}
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

export default CreateProjectFormSheet;
