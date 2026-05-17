import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import SheetWrapper from "@/components/wrappers/SheetWrapper";
import SheetHeader from "@/components/custom/SheetHeader";
import { routes } from "@/constants/routes";

const CreateProjectFormSheet = () => {
  const router = useRouter();

  const [name, setName] = useState("");

  const navigateToColor = () => {
    router.push(routes.create_project_color.href);
  };
  return (
    <SheetWrapper>
      <SheetHeader title="Create a project" submitButtonVisible />
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
          onChangeText={setName}
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
          <Text style={styles.rightSideColorText}>Charcoal</Text>
          <View style={styles.colorElement} />
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
    backgroundColor: "#3F3F46",
  },
});

export default CreateProjectFormSheet;
