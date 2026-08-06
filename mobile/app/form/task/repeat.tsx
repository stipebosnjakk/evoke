import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import Toast from "react-native-toast-message";

import SheetHeader from "@/components/custom/SheetHeader";
import SheetWrapper from "@/components/wrappers/SheetWrapper";

import { REPEAT_OPTIONS } from "@/constants/repeat";
import { routes } from "@/constants/routes";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { selectTaskById } from "@/store/selectors/task.selector";
import { setRepeat, setStatus, setTime } from "@/store/slices/formTask.slice";
import {
  updateTaskRepeatDaysAction,
  updateTaskStatusAction,
  updateTaskTimeAction,
} from "@/store/thunks/task/task.crud.thunks";
import { ScopeParams } from "@/types/initialState.types";
import { Weekday } from "@/types/task.types";
import { getErrorMessage } from "@/utils/error";
import { validateTaskRepeat } from "@/utils/validate";
import { useCalendars, useLocales } from "expo-localization";
import { formatTimeFromMin } from "@/utils/date";
import { STATUS_OPTIONS } from "@/constants/status";

type LocalSearchParamsType = {
  scope?: ScopeParams;
  taskId?: string;
};

const EMPTY_REPEAT: Weekday[] = [];

const RepeatFormSheet = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const locales = useLocales();
  const calendars = useCalendars();

  const { scope, taskId } = useLocalSearchParams<LocalSearchParamsType>();

  const formTask = useAppSelector((state) => state.formTask.task);
  const task = useAppSelector((state) =>
    taskId ? selectTaskById(state, taskId) : null,
  );

  const startTimeMin =
    formTask.start_time_min !== undefined
      ? formTask.start_time_min
      : (task?.start_time_min ?? null);

  const startDate =
    formTask.start_date !== undefined
      ? formTask.start_date
      : (task?.start_date ?? null);

  const status =
    formTask.status !== undefined ? formTask.status : (task?.status ?? null);

  const repeat =
    formTask.repeat !== undefined
      ? (formTask.repeat ?? EMPTY_REPEAT)
      : (task?.repeat ?? EMPTY_REPEAT);

  const locale = locales[0]?.languageTag ?? "en-US";
  const is24Hour = calendars[0]?.uses24hourClock ?? false;

  const startTimeLabel = formatTimeFromMin(startTimeMin, locale, is24Hour);

  const [selected, setSelected] = useState<Weekday[]>(repeat);

  useEffect(() => {
    setSelected(repeat);
  }, [repeat, taskId]);

  const hasRepeat = Boolean(selected?.length) || Boolean(repeat?.length);
  const hasStartDate = Boolean(startDate);

  const handleCloseSheet = async () => {
    if (!hasStartDate && !hasRepeat) {
      dispatch(setTime({ start_time_min: null }));
      if (task?.start_time_min) {
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

  const handleSaveRepeat = async (repeatDays: Weekday[]) => {
    if (scope === "field") {
      if (!taskId) {
        throw new Error("Task ID is missing");
      }

      if (!task) {
        throw new Error(`Task "${taskId}" is missing from state`);
      }

      await dispatch(
        updateTaskRepeatDaysAction({
          taskId,
          repeat: repeatDays,
          start_time_min: startTimeMin,
        }),
      ).unwrap();

      return;
    }

    dispatch(
      setRepeat({
        repeat: repeatDays,
      }),
    );
  };

  const handleSelectOption = (optionValue: Weekday) => {
    setSelected((current) =>
      current.includes(optionValue)
        ? current.filter((day) => day !== optionValue)
        : [...current, optionValue],
    );
  };

  const handleSubmitRepeat = async () => {
    if (formTask.status !== "next") {
      const statusOption = STATUS_OPTIONS.find((s) => s.value === "next");
      setStatus({ status: statusOption ?? null });
    }

    if (task && task.status !== "next") {
      if (!taskId) {
        throw new Error("Task ID is missing");
      }

      if (!task) {
        throw new Error(`Task "${taskId}" is missing from state`);
      }

      await dispatch(
        updateTaskStatusAction({ taskId, status: "next" }),
      ).unwrap();
    }

    const validation = validateTaskRepeat({
      repeatDays: selected,
      status,
    });

    if (!validation.ok) {
      Toast.show({
        type: "error",
        text1: "Invalid Repeat Option",
        text2: validation.message,
      });

      return;
    }

    try {
      await handleSaveRepeat(selected);
      await handleCloseSheet();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Failed to update task repeat days"),
      });
    }
  };

  const handleNoRepeat = async () => {
    try {
      await handleSaveRepeat([]);
      setSelected([]);

      await handleCloseSheet();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Failed to clear task repeat days"),
      });
    }
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

  const hasInvalidTask = !taskId || !task;
  const isTimeUnchanged = formTask.start_time_min === task?.start_time_min;
  const repeatIsUnchanged =
    selected.length === repeat.length &&
    selected.every((day) => repeat.includes(day));

  const submitDisabled =
    scope === "field"
      ? hasInvalidTask || (repeatIsUnchanged && isTimeUnchanged)
      : repeatIsUnchanged;

  return (
    <SheetWrapper>
      <SheetHeader
        title="Repeat"
        onClose={handleCloseSheet}
        onSubmit={handleSubmitRepeat}
        submitButtonVisible
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
      {(selected.length > 0 || repeat.length > 0 || startDate) && (
        <View style={styles.buttonsContainer}>
          {(selected.length > 0 || startDate || repeat.length > 0) && (
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
          )}
          {repeat.length > 0 && (
            <TouchableOpacity style={styles.button} onPress={handleNoRepeat}>
              <SymbolView
                name="minus.circle"
                weight="medium"
                size={22}
                type="monochrome"
                tintColor="rgb(67, 67, 67)"
              />
              <Text style={styles.buttonText}>No Repeat</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
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
  buttonsContainer: {
    borderTopColor: "#efefef",
    borderTopWidth: 1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "rgb(67, 67, 67)",
    fontWeight: "500",
  },
  timeButton: {
    justifyContent: "space-between",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sideButtonText: {
    fontSize: 16,
    color: "rgb(67, 67, 67)",
    fontWeight: "400",
  },
});

export default RepeatFormSheet;
