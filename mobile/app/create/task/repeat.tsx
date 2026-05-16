import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { useAppSelector } from "@/hooks/storeHooks";
import { REPEAT_OPTIONS } from "@/constants/repeat";
import { Weekday } from "@/types/task.types";
import { setRepeat } from "@/store/tasks/slices/newTask.slice";
import SheetWrapper from "@/components/wrappers/SheetWrapper";
import { validateTaskRepeat } from "@/utils/validateTask";
import SheetHeader from "@/components/custom/SheetHeader";

const RepeatFormSheet = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const repeatValue = useAppSelector((state) => state.newTask.task.repeat);

  const [selected, setSelected] = useState<Weekday[]>(repeatValue ?? []);

  const handleSubmitRepeat = () => {
    const res = validateTaskRepeat(selected);
    if (!res.ok) {
      Toast.show({
        type: "error",
        text1: "Invalid Repeat Option",
        text2: res.message,
      });
      setSelected([]);
      return;
    }

    dispatch(setRepeat({ repeat: selected }));
    router.back();
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

  const repeatValueLength = repeatValue?.length ?? 0;
  const submitDisabled = selected.length === 0 && repeatValueLength === 0;

  return (
    <SheetWrapper>
      <SheetHeader
        title="Repeat"
        onClose={handleGoBack}
        onSubmit={handleSubmitRepeat}
        submitButtonVisible={true}
        submitDisabled={submitDisabled}
      />
      <View style={styles.wrapper}>
        <View style={styles.card}>
          {REPEAT_OPTIONS.map((option, index) => {
            const isSelected = selected.includes(option.value);
            const isLast = index === REPEAT_OPTIONS.length - 1;

            return (
              <TouchableOpacity
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
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SheetWrapper>
  );
};

const styles = StyleSheet.create({
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
    borderBottomColor: "#efefef",
    paddingHorizontal: 14,
  },
  optionLabel: {
    fontSize: 16,
    color: "black",
    padding: 14,
  },
});

export default RepeatFormSheet;
