import { useRef, useState } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";

import CalendarView from "./components/CalendarView";
import DateInput from "./components/DateInput";
import Button from "@/components/ui/Button";
import { setStartDate } from "@/store/tasks/slices/newTask.slice";
import { IsoDate } from "@/types/task.types";
import { useAppSelector } from "@/hooks/storeHooks";
import { SymbolView } from "expo-symbols";
import Shortcuts from "./components/Shortcuts";

const DateFormSheet = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const inputRef = useRef<TextInput>(null);

  const deadlineValue = useAppSelector((state) => state.newTask.task.deadline);
  const startDateValue = useAppSelector(
    (state) => state.newTask.task.start_date,
  );

  const [isDateInputOpen, setIsDateInputOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<IsoDate | null>(
    startDateValue || null,
  );

  const handleNewStartDateSelect = (date: IsoDate | null) => {
    dispatch(setStartDate({ start_date: date }));
    router.back();
  };

  const handleSubmitDate = () => {
    if (isDateInputOpen) {
      inputRef.current?.blur();
      setIsDateInputOpen(false);
    }

    handleNewStartDateSelect(selected);
  };

  const handleGoBack = () => {
    setSelected(null);
    if (isDateInputOpen) {
      inputRef.current?.blur();
      setIsDateInputOpen(false);
      return;
    }
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
        <Text style={styles.title}>Date</Text>
        <Button
          style={{
            opacity: isDateInputOpen ? 0 : selected ? 1 : 0.5,
          }}
          disabled={!isDateInputOpen && !selected}
          iconOnly
          onPress={handleSubmitDate}
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
      <DateInput
        inputRef={inputRef}
        isOpen={isDateInputOpen}
        setIsOpen={setIsDateInputOpen}
        dateValue={selected || startDateValue}
        handleNewDateSelect={handleNewStartDateSelect}
      />
      {!isDateInputOpen && (
        <View>
          <Shortcuts
            type="start_date"
            selectedStartDate={startDateValue || null}
            selectedDeadline={deadlineValue || null}
            handleNewDateSelect={handleNewStartDateSelect}
          />
          <CalendarView selected={selected} setSelected={setSelected} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
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
});

export default DateFormSheet;
