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
import { setRepeat } from "@/store/slices/formTask.slice";
import { updateTaskRepeatDaysAction } from "@/store/thunks/task/task.crud.thunks";
import { ModeType } from "@/types/initialState.types";
import { Weekday } from "@/types/task.types";
import { getErrorMessage } from "@/utils/error";
import { validateTaskRepeat } from "@/utils/validate";

type LocalSearchParamsType = {
  mode?: ModeType;
  taskId?: string;
};

const EMPTY_REPEAT: Weekday[] = [];

const RepeatFormSheet = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { mode, taskId } = useLocalSearchParams<LocalSearchParamsType>();

  const formRepeat = useAppSelector((state) => state.formTask.task.repeat);

  const task = useAppSelector((state) =>
    mode === "edit" && taskId ? selectTaskById(state, taskId) : undefined,
  );

  const repeat =
    mode === "edit"
      ? (task?.repeat ?? EMPTY_REPEAT)
      : (formRepeat ?? EMPTY_REPEAT);

  const [selected, setSelected] = useState<Weekday[]>(repeat);

  useEffect(() => {
    setSelected(repeat);
  }, [repeat, mode, taskId]);

  const handleCloseSheet = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(routes.today.href);
  };

  const handleSaveRepeat = async (repeatDays: Weekday[]) => {
    if (mode === "edit") {
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
    const validation = validateTaskRepeat({ repeatDays: selected });

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
      handleCloseSheet();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Unable to Save Repeat",
        text2: getErrorMessage(error, "Failed to update task repeat days"),
      });
    }
  };

  const handleNoRepeat = async () => {
    try {
      await handleSaveRepeat([]);
      setSelected([]);

      handleCloseSheet();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Unable to Clear Repeat",
        text2: getErrorMessage(error, "Failed to clear task repeat days"),
      });
    }
  };

  const repeatIsUnchanged =
    selected.length === repeat.length &&
    selected.every((day) => repeat.includes(day));

  return (
    <SheetWrapper>
      <SheetHeader
        title="Repeat"
        onClose={handleCloseSheet}
        onSubmit={handleSubmitRepeat}
        submitButtonVisible
        submitDisabled={
          (mode === "edit" && (!taskId || !task)) || repeatIsUnchanged
        }
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
      {repeat.length > 0 && (
        <View style={styles.buttonsContainer}>
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
});

export default RepeatFormSheet;
