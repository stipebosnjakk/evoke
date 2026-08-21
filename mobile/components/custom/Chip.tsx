import { Text, Pressable, StyleSheet, View } from "react-native";
import { SymbolView } from "expo-symbols";

type ChipComponentType = {
  label: string;
  icon?: string;
  disabled?: boolean;
  onPress?: () => void;
};

export type ChipType = ChipComponentType & {
  id?: string;
};

const Chip = ({ label, icon, disabled, onPress }: ChipComponentType) => {
  const Comp = onPress ? Pressable : View;
  return (
    <Comp
      onPress={disabled ? undefined : onPress}
      style={[styles.chip, disabled ? styles.chipDisabled : null]}
    >
      {icon ? (
        <SymbolView
          name={icon as any}
          weight="medium"
          size={20}
          type="monochrome"
          tintColor="rgb(67, 67, 67)"
        />
      ) : null}
      <Text
        style={[styles.chipText, disabled ? styles.chipTextDisabled : null]}
      >
        {label}
      </Text>
    </Comp>
  );
};

export default Chip;

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "#efefef",
  },
  chipDisabled: {
    opacity: 0.45,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.85,
    color: "rgb(67, 67, 67)",
  },
  chipTextActive: {
    color: "white",
    opacity: 1,
  },
  chipTextDisabled: {
    opacity: 0.8,
  },
});
