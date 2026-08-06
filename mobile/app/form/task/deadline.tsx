import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
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
import { setDeadline } from "@/store/slices/formTask.slice";
import { updateTaskDeadlineAction } from "@/store/thunks/task/task.crud.thunks";
import { IsoDate } from "@/types/task.types";
import { minDate } from "@/utils/date";
import { getErrorMessage } from "@/utils/error";
import { validateTaskDeadline } from "@/utils/validate";
import { ScopeParams } from "@/types/initialState.types";

type LocalSearchParamsType = {
  scope?: ScopeParams;
  taskId?: string;
};

const DeadlineFormSheet = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const inputRef = useRef<TextInput>(null);

  const { scope, taskId } = useLocalSearchParams<LocalSearchParamsType>();

  const task = useAppSelector((state) =>
    taskId ? selectTaskById(state, taskId) : null,
  );

  const formDeadline = useAppSelector((state) => state.formTask.task.deadline);
  const formStartDate = useAppSelector(
    (state) => state.formTask.task.start_date,
  );

  const deadline =
    formDeadline !== undefined ? formDeadline : (task?.deadline ?? null);

  const startDate =
    formStartDate !== undefined ? formStartDate : (task?.start_date ?? null);

  const [isDateInputOpen, setIsDateInputOpen] = useState(false);
  const [selected, setSelected] = useState<IsoDate | null>(deadline);

  useEffect(() => {
    setSelected(deadline);
  }, [deadline, taskId]);

  const minDeadlineDate = minDate("deadline", startDate);

  const handleCloseSheet = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(routes.today.href);
  };

  const handleSaveDeadline = async (date: IsoDate | null) => {
    if (scope === "field") {
      if (!taskId) {
        throw new Error("Task ID is missing");
      }

      if (!task) {
        throw new Error(`Task "${taskId}" is missing from state`);
      }

      await dispatch(
        updateTaskDeadlineAction({
          taskId,
          deadline: date,
        }),
      ).unwrap();

      return;
    }

    dispatch(
      setDeadline({
        deadline: date,
      }),
    );
  };

  const handleSubmitDeadline = async () => {
    if (isDateInputOpen) {
      inputRef.current?.blur();
      setIsDateInputOpen(false);
    }

    const validation = validateTaskDeadline({
      deadline: selected,
      startDate,
    });

    if (!validation.ok) {
      Toast.show({
        type: "error",
        text1: "Invalid Deadline",
        text2: validation.message,
      });

      return;
    }

    try {
      await handleSaveDeadline(selected);

      handleCloseSheet();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Unable to Save Deadline",
        text2: getErrorMessage(error, "Failed to update task deadline"),
      });
    }
  };

  const handleNoDeadline = async () => {
    try {
      await handleSaveDeadline(null);
      setSelected(null);

      handleCloseSheet();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Unable to Clear Deadline",
        text2: getErrorMessage(error, "Failed to clear task deadline"),
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

  const isDeadlineUnchanged = selected === deadline;
  const hasInvalidTask = !taskId || !task;

  const submitDisabled =
    scope === "field"
      ? hasInvalidTask || isDeadlineUnchanged
      : isDeadlineUnchanged;

  return (
    <SheetWrapper>
      <SheetHeader
        title="Deadline"
        onClose={handleGoBack}
        onSubmit={handleSubmitDeadline}
        submitButtonVisible
        submitDisabled={submitDisabled}
      />
      <DateInput
        type="deadline"
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
              type="deadline"
              selectedStartDate={startDate}
              selectedDeadline={selected}
              handleNewDateSelect={setSelected}
            />
            <CalendarView
              minDate={minDeadlineDate}
              selected={selected}
              setSelected={setSelected}
            />
          </View>
          {deadline !== null && (
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={handleNoDeadline}
              >
                <SymbolView
                  name="minus.circle"
                  weight="medium"
                  size={22}
                  type="monochrome"
                  tintColor="rgb(67, 67, 67)"
                />
                <Text style={styles.buttonText}>No Deadline</Text>
              </TouchableOpacity>
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
  buttonsContainer: {
    borderTopColor: "#efefef",
    borderTopWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    color: "rgb(67, 67, 67)",
    fontWeight: "500",
  },
  calendarContainer: {
    paddingBottom: 10,
  },
});

export default DeadlineFormSheet;
