import { useState, useRef } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import { useAppSelector } from "@/hooks/storeHooks";
import { IsoDate } from "@/types/task.types";
import { minDate } from "@/utils/date";
import Button from "@/components/ui/Button";
import CalendarView from "./components/CalendarView";
import DateInput from "./components/DateInput";
import { setDeadline } from "@/store/tasks/slices/newTask.slice";
import Shortcuts from "./components/Shortcuts";

const DeadlineFormSheet = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const inputRef = useRef<TextInput>(null);

  const deadlineValue = useAppSelector((state) => state.newTask.task.deadline);
  const startDateValue = useAppSelector(
    (state) => state.newTask.task.start_date,
  );

  const minDeadlineDate = minDate(startDateValue ?? null);

  const [isDateInputOpen, setIsDateInputOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<IsoDate | null>(
    deadlineValue || null,
  );

  const handleNewDeadlineSelect = (date: IsoDate | null) => {
    dispatch(setDeadline({ deadline: date }));
    router.back();
  };

  const handleSubmitDeadline = () => {
    if (isDateInputOpen) {
      inputRef.current?.blur();
      setIsDateInputOpen(false);
    }

    handleNewDeadlineSelect(selected);
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
        <Text style={styles.title}>Deadline</Text>
        <Button
          style={{
            opacity: isDateInputOpen ? 0 : selected ? 1 : 0.5,
          }}
          disabled={!isDateInputOpen && !selected}
          iconOnly
          onPress={handleSubmitDeadline}
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
        dateValue={selected || deadlineValue}
        handleNewDateSelect={handleNewDeadlineSelect}
      />
      {!isDateInputOpen && (
        <View>
          <Shortcuts
            type="deadline"
            selectedStartDate={startDateValue || null}
            selectedDeadline={deadlineValue || null}
            handleNewDateSelect={handleNewDeadlineSelect}
          />
          <CalendarView
            minDate={minDeadlineDate as IsoDate}
            selected={selected}
            setSelected={setSelected}
          />
        </View>
      )}
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
});

export default DeadlineFormSheet;
