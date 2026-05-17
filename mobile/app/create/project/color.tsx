import { View, StyleSheet } from "react-native";

import { projectColors } from "@/constants/colors";
import { SymbolView } from "expo-symbols";
import SheetWrapper from "@/components/wrappers/SheetWrapper";
import SheetHeader from "@/components/custom/SheetHeader";

const ColorFormSheet = () => {
  const selected = false;
  return (
    <SheetWrapper>
      <SheetHeader title="Color" />
      <View style={styles.container}>
        {projectColors.map((color) => (
          <View
            key={color.value}
            style={[styles.colorContainer, { backgroundColor: color.value }]}
          >
            {selected && (
              <SymbolView
                name="checkmark"
                weight="medium"
                size={20}
                type="monochrome"
                tintColor="rgb(67, 67, 67)"
              />
            )}
          </View>
        ))}
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
  },
});

export default ColorFormSheet;
