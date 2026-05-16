import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { useCalendars, useLocales } from "expo-localization";
import Toast from "react-native-toast-message";

import CalendarView from "@/components/features/CalendarView";
import DateInput from "@/components/features/DateInput";
import Shortcuts from "@/components/features/Shortcuts";
import { setStartDate, setTime } from "@/store/tasks/slices/newTask.slice";
import { IsoDate } from "@/types/task.types";
import { useAppSelector } from "@/hooks/storeHooks";
import { SymbolView } from "expo-symbols";
import { formatTimeFromMin, minDate } from "@/utils/date";
import { routes } from "@/constants/routes";
import SheetWrapper from "@/components/wrappers/SheetWrapper";
import { validateTaskStartDate } from "@/utils/validateTask";
import SheetHeader from "@/components/custom/SheetHeader";

const DateFormSheet = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const locales = useLocales();
  const calendars = useCalendars();
  const inputRef = useRef<TextInput>(null);

  const startTimeMin = useAppSelector(
    (state) => state.newTask.task.start_time_min,
  );
  const durationMin = useAppSelector(
    (state) => state.newTask.task.duration_min,
  );
  const deadlineValue = useAppSelector((state) => state.newTask.task.deadline);
  const startDateValue = useAppSelector(
    (state) => state.newTask.task.start_date,
  );

  const locale = locales[0]?.languageTag ?? "en-US";
  const is24Hour = calendars[0]?.uses24hourClock ?? false;

  const startTimeLabel = formatTimeFromMin(
    startTimeMin ?? null,
    locale,
    is24Hour,
  );

  const totalDurationMin =
    startTimeMin != null && durationMin != null
      ? startTimeMin + durationMin
      : null;
  const durationLabel = formatTimeFromMin(totalDurationMin, locale, is24Hour);

  const [isDateInputOpen, setIsDateInputOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<IsoDate | null>(
    startDateValue || null,
  );

  const selectedDate = selected ?? startDateValue ?? null;

  const maxDateValue = minDate("start_date", deadlineValue || null);

  useEffect(() => {
    setSelected(startDateValue ?? null);
  }, [startDateValue]);

  const handleNewStartDateSelect = (date: IsoDate | null) => {
    const res = validateTaskStartDate(date, deadlineValue);
    if (!res.ok) {
      Toast.show({
        type: "error",
        text1: "Invalid Start Date",
        text2: res.message,
      });
      setSelected(null);
      return;
    }

    dispatch(setStartDate({ start_date: date }));
    router.back();
  };

  const handleSubmitDate = () => {
    if (isDateInputOpen) {
      inputRef.current?.blur();
      setIsDateInputOpen(false);
    }

    if (!selected) return;

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
    dispatch(setStartDate({ start_date: null }));
    dispatch(setTime({ start_time_min: null, duration_min: null }));
    setSelected(null);
    router.back();
  };

  return (
    <SheetWrapper>
      <SheetHeader
        title="Date"
        onClose={handleGoBack}
        onSubmit={handleSubmitDate}
        submitButtonVisible={true}
        submitDisabled={!isDateInputOpen && !selectedDate}
      />
      <DateInput
        type="start"
        inputRef={inputRef}
        isOpen={isDateInputOpen}
        setIsOpen={setIsDateInputOpen}
        dateValue={selectedDate}
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
              selected={selectedDate}
              setSelected={setSelected}
            />
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, { justifyContent: "space-between" }]}
              onPress={() => {
                router.push(routes.create_task_time.href);
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
                {!startTimeLabel && !durationLabel && (
                  <Text style={styles.sideButtonText}>None</Text>
                )}
                {startTimeLabel && !durationLabel && (
                  <Text style={styles.sideButtonText}>{startTimeLabel}</Text>
                )}
                {startTimeLabel && durationLabel && (
                  <Text style={styles.sideButtonText}>
                    {startTimeLabel} - {durationLabel}
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
            </TouchableOpacity>
            {startDateValue && (
              <TouchableOpacity style={styles.button} onPress={handleNoDate}>
                <SymbolView
                  name="minus.circle"
                  weight="medium"
                  size={22}
                  type="monochrome"
                  tintColor="rgb(67, 67, 67)"
                />
                <Text style={styles.buttonText}>No Date</Text>
              </TouchableOpacity>
            )}
          </View>
        </>
      )}
    </SheetWrapper>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 20,
  },
  buttonsContainer: {
    borderTopColor: "#efefef",
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
