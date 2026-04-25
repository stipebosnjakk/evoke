import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";

import { useAppSelector } from "@/hooks/storeHooks";
import { REPEAT_OPTIONS } from "@/constants/repeat";
import Button from "@/components/ui/Button";
import { Weekday } from "@/types/task.types";
import { setRepeat } from "@/store/tasks/slices/newTask.slice";

const RepeatFormSheet = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const repeatValue = useAppSelector((state) => state.newTask.task.repeat);

  const [selected, setSelected] = useState<Weekday[]>(repeatValue ?? []);

  const handleSubmitRepeat = () => {
    dispatch(setRepeat({ repeat: selected }));
    router.back();
    return;
  };

  const handleSelectOption = (optionValue: Weekday) => {
    if (selected?.includes(optionValue)) {
      setSelected(selected.filter((s) => s !== optionValue));
      return;
    }
    setSelected((prev) => (prev ? [...prev, optionValue] : [optionValue]));
  };

  const handleGoBack = () => {
    setSelected([]);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Button iconOnly onPress={handleGoBack}>
          <SymbolView
            name="xmark"
            weight="medium"
            size={20}
            type="monochrome"
            tintColor="rgb(67, 67, 67)"
          />
        </Button>
        <Text style={styles.title}>Repeat</Text>
        <Button
          style={{
            opacity: repeatValue
              ? repeatValue.length > 0
                ? 1
                : 0.5
              : selected.length > 0
                ? 1
                : 0.5,
          }}
          disabled={selected.length === 0 && repeatValue?.length === 0}
          iconOnly
          onPress={handleSubmitRepeat}
        >
          <SymbolView
            name="checkmark"
            weight="medium"
            size={20}
            type="monochrome"
            tintColor="rgb(67, 67, 67)"
          />
        </Button>
      </View>
      <View style={styles.wrapper}>
        <View style={styles.card}>
          {REPEAT_OPTIONS.map((option, index) => {
            const isSelected = selected.includes(option.value);
            const isLast = index === REPEAT_OPTIONS.length - 1;

            return (
              <Button
                key={option.id}
                style={[
                  styles.optionContainer,
                  { borderBottomWidth: isLast ? 0 : 1 },
                ]}
                onPress={() => handleSelectOption(option.value)}
              >
                <Text style={styles.optionLabel}>{option.label}</Text>
                {isSelected && (
                  <SymbolView
                    name="checkmark"
                    weight="medium"
                    size={20}
                    type="monochrome"
                    tintColor="rgb(67, 67, 67)"
                  />
                )}
              </Button>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  wrapper: {
    padding: 20,
  },
  card: {
    backgroundColor: "rgb(240, 240, 240)",
    borderRadius: 20,
    overflow: "hidden",
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: "rgba(0,0,0,0.06)",
    paddingHorizontal: 14,
  },
  optionLabel: {
    fontSize: 18,
    color: "black",
    padding: 14,
  },
});

export default RepeatFormSheet;
