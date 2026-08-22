import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import { routes } from "@/constants/routes";
import ScreenWrapper from "@/components/wrappers/ScreenWrapper";
import { SymbolView } from "expo-symbols";

const NoTasksView = () => {
  const router = useRouter();

  const navigateToCreateModal = () => {
    router.push({
      pathname: routes.form_task.href,
      params: {
        mode: "create",
      },
    });
  };

  return (
    <ScreenWrapper>
      <View style={styles.emptyContainer}>
        <TouchableOpacity onPress={navigateToCreateModal} style={styles.button}>
          <SymbolView name="plus" size={16} tintColor="#555" />
          <Text style={styles.buttonText}>Add task</Text>
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
    borderWidth: 1,
    borderColor: "#C7C7C7",
    borderStyle: "dashed",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 9,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
});

export default NoTasksView;
