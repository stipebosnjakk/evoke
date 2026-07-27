import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";

import { projectColors } from "@/constants/colors";
import { SymbolView } from "expo-symbols";
import SheetWrapper from "@/components/wrappers/SheetWrapper";
import SheetHeader from "@/components/custom/SheetHeader";
import { setColor } from "@/store/slices/formProject.slice";
import { useAppSelector } from "@/hooks/storeHooks";

const ColorFormSheet = () => {
  const dispatch = useDispatch();

  const selectedColor = useAppSelector(
    (state) => state.formProject.project.color,
  );

  return (
    <SheetWrapper>
      <SheetHeader title="Color" />
      <View style={styles.container}>
        {projectColors.map((projectColor) => {
          const backgroundColor = projectColor.hex;
          const isSelected = selectedColor === projectColor.hex;

          return (
            <TouchableOpacity
              key={projectColor.hex}
              onPress={() => {
                dispatch(setColor({ color: projectColor.hex }));
              }}
              style={[styles.colorContainer, { backgroundColor }]}
              activeOpacity={0.8}
            >
              {isSelected && (
                <SymbolView
                  name="checkmark"
                  weight="medium"
                  size={20}
                  type="monochrome"
                  tintColor="#FFFFFF"
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </SheetWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    marginTop: 20,
  },
  colorContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ColorFormSheet;
