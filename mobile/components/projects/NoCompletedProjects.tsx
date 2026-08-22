import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SymbolView } from "expo-symbols";

import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import { useAppDispatch } from "@/hooks/storeHooks";
import { updateScreenView } from "@/store/slices/config.slice";
import { PROJECTS_SCOPE_ID, VIEW_OPTIONS } from "@/constants/scopeIds";

const NoCompletedProjects = () => {
  const dispatch = useAppDispatch();

  const navigateToActiveProjects = () => {
    dispatch(
      updateScreenView({
        scopeId: PROJECTS_SCOPE_ID,
        view: VIEW_OPTIONS.active.view,
      }),
    );
  };

  return (
    <ScreenWrapper>
      <View style={styles.emptyContainer}>
        <Text style={styles.titleText}>No completed projects to show</Text>
        <TouchableOpacity
          activeOpacity={0.75}
          onPress={navigateToActiveProjects}
          style={styles.button}
        >
          <SymbolView name="folder" size={16} tintColor="#555" />
          <Text style={styles.buttonText}>View active projects</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 10,
  },
  titleText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "400",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 9,
    backgroundColor: "#FFFFFF",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
});

export default NoCompletedProjects;
