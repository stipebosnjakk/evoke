import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCalendars, useLocales } from "expo-localization";
import { SymbolView } from "expo-symbols";
import Toast from "react-native-toast-message";

import CalendarView from "@/components/features/CalendarView";
import DateInput from "@/components/features/DateInput";
import Shortcuts from "@/components/features/Shortcuts";
import SheetHeader from "@/components/custom/SheetHeader";
import SheetWrapper from "@/components/wrappers/SheetWrapper";

import { routes } from "@/constants/routes";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { selectTaskById } from "@/store/selectors/task.selector";
import { setStartDate, setTime } from "@/store/slices/formTask.slice";
import { updateTaskStartDateAction } from "@/store/thunks/task/task.crud.thunks";
import { IsoDate } from "@/types/task.types";
import { formatTimeFromMin, minDate } from "@/utils/date";
import { validateTaskStartDate } from "@/utils/validate";
import { getErrorMessage } from "@/utils/error";
import { ModeType } from "@/types/initialState.types";

type LocalSearchParamsType = {
  mode?: ModeType;
  taskId?: string;
};

const DateFormSheet = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const locales = useLocales();
  const calendars = useCalendars();

  const inputRef = useRef<TextInput>(null);

  const { mode, taskId } = useLocalSearchParams<LocalSearchParamsType>();

  const formStartDate = useAppSelector(
    (state) => state.formTask.task.start_date,
  );

  const formDeadline = useAppSelector((state) => state.formTask.task.deadline);

  const formStartTimeMin = useAppSelector(
    (state) => state.formTask.task.start_time_min,
  );

  const task = useAppSelector((state) =>
    mode === "edit" && taskId ? selectTaskById(state, taskId) : undefined,
  );

  const startDate =
    mode === "edit" ? (task?.start_date ?? null) : (formStartDate ?? null);

  const deadline =
    mode === "edit" ? (task?.deadline ?? null) : (formDeadline ?? null);

  const startTimeMin =
    mode === "edit"
      ? (task?.start_time_min ?? null)
      : (formStartTimeMin ?? null);

  const [isDateInputOpen, setIsDateInputOpen] = useState(false);
  const [selected, setSelected] = useState<IsoDate | null>(startDate);

  useEffect(() => {
    setSelected(startDate);
  }, [startDate, mode, taskId]);

  const locale = locales[0]?.languageTag ?? "en-US";
  const is24Hour = calendars[0]?.uses24hourClock ?? false;

  const startTimeLabel = formatTimeFromMin(startTimeMin, locale, is24Hour);

  const maxDateValue = minDate("start_date", deadline);

  const handleCloseSheet = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(routes.today.href);
  };

  const handleSaveStartDate = async (date: IsoDate | null) => {
    if (mode === "edit") {
      if (!taskId) {
        throw new Error("Task ID is missing");
      }

      if (!task) {
        throw new Error(`Task "${taskId}" is missing from state`);
      }

      await dispatch(
        updateTaskStartDateAction({
          taskId,
          start_date: date,
        }),
      ).unwrap();

      return;
    }

    dispatch(
      setStartDate({
        start_date: date,
      }),
    );

    if (date === null) {
      dispatch(
        setTime({
          start_time_min: null,
        }),
      );
    }
  };

  const handleNewStartDateSelect = (date: IsoDate | null) => {
    const validation = validateTaskStartDate({
      start_date: date,
      deadline: deadline,
    });

    if (!validation.ok) {
      Toast.show({
        type: "error",
        text1: "Invalid Start Date",
        text2: validation.message,
      });

      return;
    }

    setSelected(validation.data);
  };

  const handleSubmitDate = async () => {
    if (isDateInputOpen) {
      inputRef.current?.blur();
      setIsDateInputOpen(false);
    }

    try {
      await handleSaveStartDate(selected);

      handleCloseSheet();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Unable to Save Date",
        text2: getErrorMessage(error, "Failed to update task start date"),
      });
    }
  };

  const handleNoDate = async () => {
    try {
      await handleSaveStartDate(null);
      setSelected(null);

      handleCloseSheet();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Unable to Clear Date",
        text2: getErrorMessage(error, "Failed to clear task start date"),
      });
    }
  };

  const handleGoBack = () => {
    if (isDateInputOpen) {
      inputRef.current?.blur();
      setIsDateInputOpen(false);
      return;
    }

    handleCloseSheet();
  };

  const handleOpenTime = () => {
    if (mode === "create") {
      dispatch(
        setStartDate({
          start_date: selected,
        }),
      );
    }

    router.push({
      pathname: routes.form_task_time.href,
      params: taskId
        ? {
            mode,
            taskId,
          }
        : {
            mode,
          },
    });
  };

  return (
    <SheetWrapper>
      <SheetHeader
        title="Date"
        onClose={handleGoBack}
        onSubmit={handleSubmitDate}
        submitButtonVisible
        submitDisabled={
          (mode === "edit" && (!taskId || !task)) || selected === startDate
        }
      />
      <DateInput
        type="start"
        inputRef={inputRef}
        isOpen={isDateInputOpen}
        setIsOpen={setIsDateInputOpen}
        dateValue={selected}
        handleNewDateSelect={handleNewStartDateSelect}
      />
      {!isDateInputOpen && (
        <>
          <View style={styles.calendarContainer}>
            <Shortcuts
              type="start_date"
              selectedStartDate={selected}
              selectedDeadline={deadline}
              handleNewDateSelect={handleNewStartDateSelect}
            />
            <CalendarView
              maxDate={maxDateValue}
              selected={selected}
              setSelected={handleNewStartDateSelect}
            />
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.timeButton]}
              onPress={handleOpenTime}
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
                <Text style={styles.sideButtonText}>
                  {startTimeLabel ?? "None"}
                </Text>
                <SymbolView
                  name="chevron.right"
                  weight="light"
                  size={16}
                  type="monochrome"
                  tintColor="rgb(67, 67, 67)"
                />
              </View>
            </TouchableOpacity>
            {selected !== null && (
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
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 20,
  },
  timeButton: {
    justifyContent: "space-between",
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
