import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { routes } from "@/constants/routes";
import ScreenWrapper from "@/components/wrappers/ScreenWrapper";

const NoProjectsView = () => {
  const router = useRouter();

  const navigateToCreateProject = () => {
    router.push({
      pathname: routes.form_project.href,
      params: {
        mode: "create",
      },
    });
  };

  return (
    <ScreenWrapper>
      <View style={styles.emptyContainer}>
        <TouchableOpacity
          onPress={navigateToCreateProject}
          style={styles.button}
        >
          <Ionicons name="folder-outline" size={16} color="#555" />
          <Text style={styles.buttonText}>Add project</Text>
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
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderWidth: 1,
    borderColor: "#C7C7C7",
    borderStyle: "dashed",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
});

export default NoProjectsView;
