import { useRef, useState } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { useCalendars, useLocales } from "expo-localization";

import CalendarView from "./components/CalendarView";
import DateInput from "./components/DateInput";
import Button from "@/components/ui/Button";
import Shortcuts from "./components/Shortcuts";
import { setStartDate } from "@/store/tasks/slices/newTask.slice";
import { IsoDate } from "@/types/task.types";
import { useAppSelector } from "@/hooks/storeHooks";
import { SymbolView } from "expo-symbols";
import { formatTimeFromMin, minDate } from "@/utils/date";
import { routes } from "@/constants/routes";

// TODO: make a time picker
// TODO: impement smart text for time
// TODO: make a custom dropdown for status and repeat
// TODO: test if conflict is working between start date and deadline, with error warnings for creating task
// TODO: try to fix toast message showing behind formSheet

const DateFormSheet = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const locales = useLocales();
  const calendars = useCalendars();
  const inputRef = useRef<TextInput>(null);

  const startTimeMin = useAppSelector(
    (state) => state.newTask.task.start_time_min,
  );
  const dueTimeMin = useAppSelector((state) => state.newTask.task.due_time_min);
  const deadlineValue = useAppSelector((state) => state.newTask.task.deadline);

  const locale = locales[0]?.languageTag ?? "en-US";
  const is24Hour = calendars[0]?.uses24hourClock ?? false;

  const startTimeLabel = formatTimeFromMin(
    startTimeMin ?? null,
    locale,
    is24Hour,
  );
  const dueTimeLabel = formatTimeFromMin(dueTimeMin ?? null, locale, is24Hour);
  // FIX: due time is not showing
  // FIX: check if due time is alright after setting duration, is time correct

  const startDateValue = useAppSelector(
    (state) => state.newTask.task.start_date,
  );

  const [isDateInputOpen, setIsDateInputOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<IsoDate | null>(
    startDateValue || null,
  );

  const maxDateValue = minDate("start_date", deadlineValue || null);

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

  const handleNoDate = () => {
    // TODO: also add for time
    dispatch(setStartDate({ start_date: null }));
    setSelected(null);
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
        <>
          <View style={styles.calendarContainer}>
            <Shortcuts
              type="start_date"
              selectedStartDate={startDateValue || null}
              selectedDeadline={deadlineValue || null}
              handleNewDateSelect={handleNewStartDateSelect}
            />
            <CalendarView
              maxDate={maxDateValue}
              selected={selected}
              setSelected={setSelected}
            />
          </View>
          <View style={styles.buttonsContainer}>
            <Button
              style={[styles.button, { justifyContent: "space-between" }]}
              onPress={() => {
                router.push(routes.time.href);
              }}
            >
              <View style={styles.buttonContent}>
                <SymbolView
                  name="clock"
                  weight="medium"
                  size={22}
                  type="monochrome"
                  tintColor="rgb(67, 67, 67)"
                />
                <Text style={styles.buttonText}>Time</Text>
              </View>
              <View style={styles.buttonContent}>
                {!startTimeLabel && !dueTimeLabel && (
                  <Text style={styles.sideButtonText}>None</Text>
                )}
                {startTimeLabel && !dueTimeLabel && (
                  <Text style={styles.sideButtonText}>{startTimeLabel}</Text>
                )}
                {startTimeLabel && dueTimeLabel && (
                  <Text style={styles.sideButtonText}>
                    {startTimeLabel} - {dueTimeLabel}
                  </Text>
                )}
                <SymbolView
                  name="chevron.right"
                  weight="light"
                  size={16}
                  type="monochrome"
                  tintColor="rgb(67, 67, 67)"
                />
              </View>
            </Button>
            {startDateValue && (
              <Button style={styles.button} onPress={handleNoDate}>
                <SymbolView
                  name="minus.circle"
                  weight="medium"
                  size={22}
                  type="monochrome"
                  tintColor="rgb(67, 67, 67)"
                />
                <Text style={styles.buttonText}>No Date</Text>
              </Button>
            )}
          </View>
        </>
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
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 20,
  },
  buttonsContainer: {
    borderTopColor: "rgba(0,0,0,0.06)",
    borderTopWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    color: "rgb(67, 67, 67)",
    fontWeight: "500",
  },
  sideButtonText: {
    fontSize: 16,
    color: "rgb(67, 67, 67)",
    fontWeight: "400",
  },
  calendarContainer: {
    paddingBottom: 10,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});

export default DateFormSheet;
