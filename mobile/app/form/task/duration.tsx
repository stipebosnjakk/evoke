import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";
import Toast from "react-native-toast-message";

import SheetHeader from "@/components/custom/SheetHeader";
import SheetWrapper from "@/components/wrappers/SheetWrapper";

import { routes } from "@/constants/routes";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { selectTaskById } from "@/store/selectors/task.selector";
import { setDuration } from "@/store/slices/formTask.slice";
import { updateTaskDurationAction } from "@/store/thunks/task/task.crud.thunks";
import { ScopeParams } from "@/types/initialState.types";
import { getDurationFromDurationMin } from "@/utils/date";
import { getErrorMessage } from "@/utils/error";
import { validateTaskDuration } from "@/utils/validate";

type LocalSearchParamsType = {
  scope?: ScopeParams;
  taskId?: string;
};

const DurationFormSheet = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { scope, taskId } = useLocalSearchParams<LocalSearchParamsType>();

  const task = useAppSelector((state) =>
    taskId ? selectTaskById(state, taskId) : null,
  );

  const formDurationMin = useAppSelector(
    (state) => state.formTask.task.duration_min,
  );

  const durationMin =
    formDurationMin !== undefined
      ? formDurationMin
      : (task?.duration_min ?? null);

  const { hours, minutes } = getDurationFromDurationMin(durationMin) ?? {
    hours: 0,
    minutes: 0,
  };

  const [durationHours, setDurationHours] = useState(hours);
  const [durationMinutes, setDurationMinutes] = useState(minutes);

  useEffect(() => {
    setDurationHours(hours);
    setDurationMinutes(minutes);
  }, [durationMin, taskId, hours, minutes]);

  const hourOptions = useMemo(
    () => Array.from({ length: 24 }, (_, hour) => hour),
    [],
  );

  const minuteOptions = useMemo(
    () => Array.from({ length: 12 }, (_, index) => index * 5),
    [],
  );

  const duration_min = durationHours * 60 + durationMinutes;
  const selectedDurationMin = duration_min === 0 ? null : duration_min;
  const durationLabel = `${durationHours}:${String(durationMinutes).padStart(
    2,
    "0",
  )}`;

  const handleCloseSheet = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(routes.today.href);
  };

  const handleSaveDuration = async (value: number | null) => {
    if (scope === "field") {
      if (!taskId) {
        throw new Error("Task ID is missing");
      }

      if (!task) {
        throw new Error(`Task "${taskId}" is missing from state`);
      }

      await dispatch(
        updateTaskDurationAction({
          taskId,
          duration_min: value,
        }),
      ).unwrap();

      return;
    }

    dispatch(
      setDuration({
        duration_min: value,
      }),
    );
  };

  const handleSubmitDuration = async () => {
    const validation = validateTaskDuration({ duration_min });

    if (!validation.ok) {
      Toast.show({
        type: "error",
        text1: "Invalid Duration",
        text2: validation.message,
      });

      return;
    }

    try {
      await handleSaveDuration(validation.data);
      handleCloseSheet();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Unable to Save Duration",
        text2: getErrorMessage(error, "Failed to update task duration"),
      });
    }
  };

  const handleNoDuration = async () => {
    try {
      await handleSaveDuration(null);
      handleCloseSheet();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Unable to Clear Duration",
        text2: getErrorMessage(error, "Failed to clear task duration"),
      });
    }
  };

  const isDurationUnchanged = selectedDurationMin === durationMin;
  const hasInvalidTask = !taskId || !task;

  const submitDisabled =
    scope === "field"
      ? hasInvalidTask || isDurationUnchanged
      : isDurationUnchanged;

  return (
    <SheetWrapper>
      <SheetHeader
        title="Duration"
        onClose={handleCloseSheet}
        onSubmit={handleSubmitDuration}
        submitButtonVisible
        submitDisabled={submitDisabled}
      />
      <View style={styles.pickerContainer}>
        <View style={styles.pickerHeader}>
          <Text style={styles.label}>Duration</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{durationLabel}</Text>
          </View>
        </View>
        <View style={styles.durationPickers}>
          <Picker
            selectedValue={durationHours}
            onValueChange={(value: number) => setDurationHours(value)}
            style={styles.wheel}
            itemStyle={styles.item}
          >
            {hourOptions.map((hour) => (
              <Picker.Item
                key={hour}
                label={`${hour} h`}
                value={hour}
                color="#111111"
              />
            ))}
          </Picker>
          <Picker
            selectedValue={durationMinutes}
            onValueChange={(value: number) => setDurationMinutes(value)}
            style={styles.wheel}
            itemStyle={styles.item}
          >
            {minuteOptions.map((minute) => (
              <Picker.Item
                key={minute}
                label={`${minute} m`}
                value={minute}
                color="#111111"
              />
            ))}
          </Picker>
        </View>
      </View>
      {durationMin !== null && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={handleNoDuration}>
            <SymbolView
              name="minus.circle"
              weight="medium"
              size={22}
              type="monochrome"
              tintColor="rgb(67, 67, 67)"
            />
            <Text style={styles.buttonText}>No Duration</Text>
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
  durationPickers: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 180,
  },
  wheel: {
    flex: 1,
  },
  item: {
    fontSize: 20,
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
});

export default DurationFormSheet;
