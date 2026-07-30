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
import { ModeType } from "@/types/initialState.types";

type LocalSearchParamsType = {
  mode?: ModeType;
  taskId?: string;
};

const DeadlineFormSheet = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const inputRef = useRef<TextInput>(null);

  const { mode, taskId } = useLocalSearchParams<LocalSearchParamsType>();

  const formDeadline = useAppSelector((state) => state.formTask.task.deadline);

  const formStartDate = useAppSelector(
    (state) => state.formTask.task.start_date,
  );

  const task = useAppSelector((state) =>
    mode === "edit" && taskId ? selectTaskById(state, taskId) : undefined,
  );

  const deadline =
    mode === "edit" ? (task?.deadline ?? null) : (formDeadline ?? null);

  const startDate =
    mode === "edit" ? (task?.start_date ?? null) : (formStartDate ?? null);

  const [isDateInputOpen, setIsDateInputOpen] = useState(false);
  const [selected, setSelected] = useState<IsoDate | null>(deadline);

  useEffect(() => {
    setSelected(deadline);
  }, [deadline, mode, taskId]);

  const minDeadlineDate = minDate("deadline", startDate);

  const handleCloseSheet = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace(routes.today.href);
  };

  const handleSaveDeadline = async (date: IsoDate | null) => {
    if (mode === "edit") {
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

  const handleNewDeadlineSelect = (date: IsoDate | null) => {
    const validation = validateTaskDeadline({
      deadline: date,
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

    setSelected(validation.data);
  };

  const handleSubmitDeadline = async () => {
    if (isDateInputOpen) {
      inputRef.current?.blur();
      setIsDateInputOpen(false);
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

  return (
    <SheetWrapper>
      <SheetHeader
        title="Deadline"
        onClose={handleGoBack}
        onSubmit={handleSubmitDeadline}
        submitButtonVisible
        submitDisabled={
          (mode === "edit" && (!taskId || !task)) || selected === deadline
        }
      />
      <DateInput
        type="deadline"
        inputRef={inputRef}
        isOpen={isDateInputOpen}
        setIsOpen={setIsDateInputOpen}
        dateValue={selected}
        handleNewDateSelect={handleNewDeadlineSelect}
      />
      {!isDateInputOpen && (
        <>
          <View style={styles.calendarContainer}>
            <Shortcuts
              type="deadline"
              selectedStartDate={startDate}
              selectedDeadline={selected}
              handleNewDateSelect={handleNewDeadlineSelect}
            />
            <CalendarView
              minDate={minDeadlineDate}
              selected={selected}
              setSelected={handleNewDeadlineSelect}
            />
          </View>
          <View style={styles.buttonsContainer}>
            {selected !== null && (
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
