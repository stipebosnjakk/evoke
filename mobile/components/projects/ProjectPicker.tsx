import { View, Text, StyleSheet, Pressable } from "react-native";
import { SymbolView } from "expo-symbols";

import { ProjectStateData } from "@/types/project.types";

type SelectProjectProps = {
  project: ProjectStateData;
  isSelected: boolean;
  onPress: () => void;
};

const ProjectPicker = ({
  project,
  isSelected,
  onPress,
}: SelectProjectProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.projectContainer,
        isSelected && styles.projectContainerSelected,
      ]}
    >
      <View style={styles.projectHeader}>
        <View style={styles.projectTitleSide}>
          <SymbolView name="circle.fill" size={6} tintColor={project.color} />
          <Text
            style={styles.projectTitle}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {project.name}
          </Text>
        </View>
        <View style={styles.completionCircle}>
          {isSelected && <View style={styles.completionCircleFill} />}
          {isSelected && (
            <View style={styles.completionCheck}>
              <SymbolView
                name="checkmark"
                size={10}
                weight="bold"
                tintColor="#FFFFFF"
              />
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  projectContainer: {
    padding: 12,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "white",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#efefef",
    marginBottom: 12,
  },
  projectContainerSelected: {
    borderColor: "#BDB7AD",
  },
  projectHeader: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  projectTitleSide: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  projectTitle: {
    flex: 1,
    minWidth: 0,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
    color: "#1F1F1D",
  },
  completionCircle: {
    flexShrink: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.2,
    borderColor: "#E6E2DC",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    overflow: "hidden",
  },
  completionCircleFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#2F2F2D",
    borderRadius: 9,
  },
  completionCheck: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
});
export default ProjectPicker;
