import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SymbolView } from "expo-symbols";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import { STATUS_OPTIONS } from "@/constants/status";
import { TaskStatusOption } from "@/types/task.types";
import { setStatus } from "@/store/slices/formTask.slice";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import SheetWrapper from "@/components/wrappers/SheetWrapper";
import { validateTaskStatus } from "@/utils/validate";
import SheetHeader from "@/components/custom/SheetHeader";
import Info from "@/components/ui/Info";
import { updateTaskStatusAction } from "@/store/thunks/task/task.crud.thunks";
import { getErrorMessage } from "@/utils/error";
import { selectTaskById } from "@/store/selectors/task.selector";
import { ScopeParams } from "@/types/initialState.types";

type LocalSearchParamsType = {
  scope?: ScopeParams;
  taskId?: string;
};

const StatusFormSheet = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { scope, taskId } = useLocalSearchParams<LocalSearchParamsType>();

  const formRepeat = useAppSelector((state) => state.formTask.task.repeat);
  const formStatus = useAppSelector((state) => state.formTask.task.status);
  const task = useAppSelector((state) =>
    taskId ? selectTaskById(state, taskId) : null,
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedStatus =
    formStatus !== undefined ? formStatus : (task?.status ?? null);
  const repeat = formRepeat !== undefined ? formRepeat : (task?.repeat ?? null);

  const hasRepeat = Boolean(repeat?.length);

  const handleCreateStatus = (option: TaskStatusOption) => {
    const nextOption = formStatus === option.value ? null : option;
    const validation = validateTaskStatus({ status: nextOption, repeat });

    if (!validation.ok) {
      Toast.show({
        type: "error",
        text1: validation.message || "Invalid task status",
      });
    }

    dispatch(
      setStatus({
        status: validation.data,
      }),
    );

    router.back();
  };

  const handleEditStatus = async (option: TaskStatusOption) => {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const nextOption = task?.status === option.value ? null : option;

    const validation = validateTaskStatus({ status: nextOption, repeat });

    if (!validation.ok) {
      Toast.show({
        type: "error",
        text1: validation.message || "Invalid task status",
      });
    }

    const status = validation.data?.value ?? null;

    await dispatch(
      updateTaskStatusAction({
        taskId,
        status,
      }),
    ).unwrap();

    router.back();
  };

  const handleSubmitStatus = async (option: TaskStatusOption) => {
    if (isSubmitting || hasRepeat) {
      return;
    }

    try {
      setIsSubmitting(true);

      if (scope === "field") {
        await handleEditStatus(option);
        return;
      }

      handleCreateStatus(option);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: getErrorMessage(error, "Failed to save task status"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasInvalidTask = !taskId || !task;

  if (scope === "field" && hasInvalidTask) {
    return null;
  }

  return (
    <SheetWrapper>
      <SheetHeader title="Status" onClose={() => router.back()} />
      <View style={styles.wrapper}>
        <View>
          {STATUS_OPTIONS.map((item, index) => {
            const isSelected = selectedStatus === item.value;
            const isLast = index === STATUS_OPTIONS.length - 1;
            const disabled = hasRepeat && item.value !== "next";

            return (
              <TouchableOpacity
                key={item.value}
                onPress={() => handleSubmitStatus(item)}
                disabled={isSubmitting || disabled}
                activeOpacity={0.7}
                style={[
                  styles.optionsButton,
                  (isSubmitting || disabled) && styles.disabledButton,
                ]}
              >
                <SymbolView
                  name={item.icon as any}
                  weight="medium"
                  size={20}
                  type="monochrome"
                  tintColor="rgb(67, 67, 67)"
                />
                <View
                  style={[
                    styles.borderContainer,
                    {
                      borderBottomWidth: isLast ? 0 : 1,
                    },
                  ]}
                >
                  <Text style={styles.labels}>{item.label}</Text>
                  {isSelected && (
                    <SymbolView
                      name="checkmark"
                      weight="medium"
                      size={20}
                      type="monochrome"
                      tintColor="rgb(67, 67, 67)"
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        <Info
          text={
            hasRepeat
              ? "A repeating task must have the Next status"
              : "A task must have Next status to appear in Today."
          }
        />
      </View>
    </SheetWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
  },
  optionsButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  borderContainer: {
    flex: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  labels: {
    fontSize: 16,
    color: "black",
    fontWeight: "500",
    padding: 14,
  },
});

export default StatusFormSheet;
