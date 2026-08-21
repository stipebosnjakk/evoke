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
import {
  updateTaskStartDateAction,
  updateTaskTimeAction,
} from "@/store/thunks/task/task.crud.thunks";
import { IsoDate } from "@/types/task.types";
import { formatTimeFromMin, minDate } from "@/utils/date";
import { validateTaskStartDate } from "@/utils/validate";
import { getErrorMessage } from "@/utils/error";
import { ScopeParams } from "@/types/initialState.types";

type LocalSearchParamsType = {
  scope?: ScopeParams;
  taskId?: string;
};

const DateFormSheet = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const locales = useLocales();
  const calendars = useCalendars();

  const inputRef = useRef<TextInput>(null);

  const { scope, taskId } = useLocalSearchParams<LocalSearchParamsType>();

  const formTask = useAppSelector((state) => state.formTask.task);
  const task = useAppSelector((state) =>
    taskId ? selectTaskById(state, taskId) : null,
  );

  const startDate =
    formTask.start_date !== undefined
      ? formTask.start_date
      : (task?.start_date ?? null);

  const deadline =
    formTask.deadline !== undefined
      ? formTask.deadline
      : (task?.deadline ?? null);

  const startTimeMin =
    formTask.start_time_min !== undefined
      ? formTask.start_time_min
      : (task?.start_time_min ?? null);

  const repeat =
    formTask.repeat !== undefined ? formTask.repeat : (task?.repeat ?? null);

  const [isDateInputOpen, setIsDateInputOpen] = useState(false);
  const [selected, setSelected] = useState<IsoDate | null>(startDate);

  useEffect(() => {
    setSelected(startDate);
  }, [startDate, taskId]);

  const locale = locales[0]?.languageTag ?? "en-US";
  const is24Hour = calendars[0]?.uses24hourClock ?? false;

  const startTimeLabel = formatTimeFromMin(startTimeMin, locale, is24Hour);
  const maxDateValue = minDate("start_date", deadline);

  const hasRepeat = Boolean(repeat?.length);
  const hasStartDate = Boolean(selected ?? startDate);

  const handleCloseSheet = async () => {
    if (!hasStartDate && !hasRepeat) {
      dispatch(setTime({ start_time_min: null }));
      if (task && task.start_time_min !== null) {
        if (!task.id) {
          throw new Error("Task ID is required");
        }

        await dispatch(
          updateTaskTimeAction({ taskId: task.id, start_time_min: null }),
        ).unwrap();
      }
    }

    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(routes.today.href);
  };

  const handleSaveStartDate = async (date: IsoDate | null) => {
    if (scope === "field") {
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
          start_time_min: startTimeMin,
        }),
      ).unwrap();

      return;
    }

    dispatch(
      setStartDate({
        start_date: date,
      }),
    );
  };

  const handleSubmitDate = async () => {
    if (isDateInputOpen) {
      inputRef.current?.blur();
      setIsDateInputOpen(false);
    }

    const validation = validateTaskStartDate({
      start_date: selected,
      deadline,
    });

    if (!validation.ok) {
      Toast.show({
        type: "error",
        text1: validation.message,
      });

      return;
    }

    try {
      await handleSaveStartDate(validation.data);
      await handleCloseSheet();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Failed to update task start date"),
      });
    }
  };

  const handleNoDate = async () => {
    try {
      await handleSaveStartDate(null);
      setSelected(null);

      await handleCloseSheet();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Failed to clear task start date"),
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
    router.push({
      pathname: routes.form_task_time.href,
      params: {
        taskId,
        scope: "task",
      },
    });
  };

  const isDateUnchanged = selected === startDate;
  const isTimeUnchanged = formTask.start_time_min === task?.start_time_min;
  const hasInvalidTask = !taskId || !task;

  const submitDisabled =
    scope === "field"
      ? hasInvalidTask || (isDateUnchanged && isTimeUnchanged)
      : isDateUnchanged;

  return (
    <SheetWrapper>
      <SheetHeader
        title="Date"
        onClose={handleGoBack}
        onSubmit={handleSubmitDate}
        submitButtonVisible
        submitDisabled={submitDisabled}
      />
      <DateInput
        type="start"
        inputRef={inputRef}
        isOpen={isDateInputOpen}
        setIsOpen={setIsDateInputOpen}
        dateValue={selected}
        handleNewDateSelect={setSelected}
      />
      {!isDateInputOpen && (
        <>
          <View style={styles.calendarContainer}>
            <Shortcuts
              type="start_date"
              selectedStartDate={selected}
              selectedDeadline={deadline}
              handleNewDateSelect={setSelected}
            />
            <CalendarView
              maxDate={maxDateValue}
              selected={selected}
              setSelected={setSelected}
            />
          </View>
          {(selected || startDate || hasRepeat) && (
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
              {startDate && (
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
          )}
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
