import { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCalendars, useLocales } from "expo-localization";
import { SymbolView } from "expo-symbols";
import Toast from "react-native-toast-message";

import SheetHeader from "@/components/custom/SheetHeader";
import SheetWrapper from "@/components/wrappers/SheetWrapper";

import { routes } from "@/constants/routes";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { selectTaskById } from "@/store/selectors/task.selector";
import { setTime } from "@/store/slices/formTask.slice";
import { updateTaskTimeAction } from "@/store/thunks/task/task.crud.thunks";
import { ModeType } from "@/types/initialState.types";
import {
  formatTimeFromMin,
  getStartTimeMin,
  getTimePickerDate,
} from "@/utils/date";
import { getErrorMessage } from "@/utils/error";
import { validateTaskTime } from "@/utils/validate";

type LocalSearchParamsType = {
  mode?: ModeType;
  taskId?: string;
};

const TimeFormSheet = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const locales = useLocales();
  const calendars = useCalendars();

  const { mode, taskId } = useLocalSearchParams<LocalSearchParamsType>();

  const formStartTimeMin = useAppSelector(
    (state) => state.formTask.task.start_time_min,
  );

  const task = useAppSelector((state) =>
    mode === "edit" && taskId ? selectTaskById(state, taskId) : undefined,
  );

  const startTimeMin =
    mode === "edit"
      ? (task?.start_time_min ?? null)
      : (formStartTimeMin ?? null);

  const [selected, setSelected] = useState<Date>(() =>
    getTimePickerDate(startTimeMin),
  );

  useEffect(() => {
    setSelected(getTimePickerDate(startTimeMin));
  }, [startTimeMin, mode, taskId]);

  const locale = locales[0]?.languageTag ?? "en-US";
  const is24Hour = calendars[0]?.uses24hourClock ?? false;

  const selectedTimeMin = getStartTimeMin(selected);
  const selectedTimeLabel = formatTimeFromMin(
    selectedTimeMin,
    locale,
    is24Hour,
  );

  const handleCloseSheet = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(routes.today.href);
  };

  const handleSaveStartTime = async (value: number | null) => {
    if (mode === "edit") {
      if (!taskId) {
        throw new Error("Task ID is missing");
      }

      if (!task) {
        throw new Error(`Task "${taskId}" is missing from state`);
      }

      await dispatch(
        updateTaskTimeAction({
          taskId,
          start_time_min: value,
        }),
      ).unwrap();

      return;
    }

    dispatch(
      setTime({
        start_time_min: value,
      }),
    );
  };

  const handleTimeChange = (_: unknown, selectedTime?: Date) => {
    if (!selectedTime) {
      return;
    }

    setSelected(selectedTime);
  };

  const handleSubmitTime = async () => {
    const validation = validateTaskTime({ start_time_min: selectedTimeMin });

    if (!validation.ok) {
      Toast.show({
        type: "error",
        text1: "Invalid Time",
        text2: validation.message,
      });

      return;
    }

    try {
      await handleSaveStartTime(validation.data);
      handleCloseSheet();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Unable to Save Time",
        text2: getErrorMessage(error, "Failed to update task start time"),
      });
    }
  };

  const handleNoTime = async () => {
    try {
      await handleSaveStartTime(null);
      handleCloseSheet();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Unable to Clear Time",
        text2: getErrorMessage(error, "Failed to clear task start time"),
      });
    }
  };

  return (
    <SheetWrapper>
      <SheetHeader
        title="Time"
        onClose={handleCloseSheet}
        onSubmit={handleSubmitTime}
        submitButtonVisible
        submitDisabled={
          (mode === "edit" && (!taskId || !task)) ||
          selectedTimeMin === startTimeMin
        }
      />
      <View style={styles.pickerContainer}>
        <View style={styles.pickerHeader}>
          <Text style={styles.label}>Time</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{selectedTimeLabel}</Text>
          </View>
        </View>
        <View style={styles.pickerWrap}>
          <DateTimePicker
            value={selected}
            mode="time"
            display="spinner"
            minuteInterval={5}
            onChange={handleTimeChange}
            themeVariant="light"
            textColor="#111111"
            style={styles.picker}
          />
        </View>
      </View>
      {startTimeMin !== null && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleNoTime}>
            <SymbolView
              name="minus.circle"
              weight="medium"
              size={22}
              type="monochrome"
              tintColor="rgb(67, 67, 67)"
            />
            <Text style={styles.buttonText}>No Time</Text>
          </TouchableOpacity>
        </View>
      )}
    </SheetWrapper>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    margin: 20,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: "#F3F3F3",
    borderRadius: 24,
  },
  pickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E3E3E3",
  },
  pickerWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    height: 160,
    overflow: "hidden",
  },
  picker: {
    width: Platform.OS === "ios" ? 320 : "100%",
    height: 160,
  },
  label: {
    fontSize: 18,
    color: "#111111",
    fontWeight: "400",
  },
  badge: {
    backgroundColor: "#efefef",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontSize: 17,
    fontWeight: "500",
    color: "rgb(67, 67, 67)",
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
});

export default TimeFormSheet;
