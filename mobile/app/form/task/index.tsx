import { useEffect } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCalendars, useLocales } from "expo-localization";
import { SymbolView } from "expo-symbols";
import Toast from "react-native-toast-message";

import Chip from "@/components/ui/Chip";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import {
  createTaskAction,
  updateTaskAction,
} from "@/store/thunks/task/task.crud.thunks";
import { getErrorMessage } from "@/utils/error";
import { routes } from "@/constants/routes";
import {
  formatTimeFromMin,
  getDateLabel,
  getDurationLabel,
  getRepeatLabel,
} from "@/utils/date";
import { STATUS_OPTIONS } from "@/constants/status";
import { selectTaskById } from "@/store/selectors/task.selector";
import SheetWrapper from "@/components/wrappers/SheetWrapper";
import {
  clearTaskState,
  setDescription,
  setTitle,
  validateTextInputs,
} from "@/store/slices/formTask.slice";
import SelectProjectButton from "@/components/features/SelectProjectButton";
import {
  getTaskPlacement,
  getTaskScreenHref,
  getTaskScreenText,
} from "@/utils/taskPlacement";
import { TaskScreen } from "@/types/scope.types";
import { ModeType } from "@/types/initialState.types";

type LocalSearchParamsType = {
  mode?: ModeType;
  taskId?: string;
};

const TaskFormSheet = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const locales = useLocales();
  const calendars = useCalendars();

  const { mode, taskId } = useLocalSearchParams<LocalSearchParamsType>();

  const loading = useAppSelector((state) => state.formTask.loading);
  const title = useAppSelector((state) => state.formTask.inputs.title);
  const description = useAppSelector(
    (state) => state.formTask.inputs.description,
  );

  const formStartDate = useAppSelector(
    (state) => state.formTask.task.start_date,
  );
  const formDeadline = useAppSelector((state) => state.formTask.task.deadline);
  const formStatusValue = useAppSelector((state) => state.formTask.task.status);
  const formRepeatValue = useAppSelector((state) => state.formTask.task.repeat);
  const formStartTimeMin = useAppSelector(
    (state) => state.formTask.task.start_time_min,
  );
  const formDurationMin = useAppSelector(
    (state) => state.formTask.task.duration_min,
  );

  const task = useAppSelector((state) =>
    mode === "edit" && taskId ? selectTaskById(state, taskId) : undefined,
  );

  const startDate =
    mode === "edit" ? (task?.start_date ?? null) : (formStartDate ?? null);

  const deadline =
    mode === "edit" ? (task?.deadline ?? null) : (formDeadline ?? null);

  const statusValue =
    mode === "edit" ? (task?.status ?? null) : (formStatusValue ?? null);

  const repeatValue =
    mode === "edit" ? (task?.repeat ?? null) : (formRepeatValue ?? null);

  const startTimeMin =
    mode === "edit"
      ? (task?.start_time_min ?? null)
      : (formStartTimeMin ?? null);

  const durationMin =
    mode === "edit" ? (task?.duration_min ?? null) : (formDurationMin ?? null);

  const status = STATUS_OPTIONS.find((s) => s.value === statusValue);
  const locale = locales[0]?.languageTag ?? "en-US";
  const is24Hour = calendars[0]?.uses24hourClock ?? false;

  const startTimeLabel = formatTimeFromMin(startTimeMin, locale, is24Hour);
  const startDateLabel = startDate
    ? [getDateLabel(startDate), startTimeLabel].filter(Boolean).join(" ")
    : "Date";
  const durationLabel = getDurationLabel(durationMin);

  useEffect(() => {
    return () => {
      dispatch(clearTaskState());
    };
  }, [dispatch]);

  const handleUpdateNavigation = (id?: string) => {
    Toast.hide();

    if (!id) {
      router.dismissTo(routes.today.href);
      return;
    }

    router.dismissTo({
      pathname: routes.single_task.href,
      params: {
        taskId: id,
      },
    } as any);
  };

  const handleCreateNavigation = (placement: TaskScreen) => {
    const href = getTaskScreenHref(placement);

    Toast.hide();
    router.dismissTo(href as any);
  };

  const handleOpenTaskForm = (pathname: string) => {
    router.push({
      pathname,
      params: taskId
        ? {
            mode,
            taskId,
          }
        : {
            mode,
          },
    } as any);
  };

  const onSubmit = async () => {
    if (loading) return;
    try {
      let results;

      await dispatch(validateTextInputs());

      // TODO: toast is not showing for update task

      if (mode === "edit") {
        if (!taskId) {
          throw new Error("Task ID is required");
        }

        results = await dispatch(updateTaskAction({ taskId })).unwrap();

        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace(routes.today.href);
        }
      } else {
        results = await dispatch(createTaskAction()).unwrap();
      }

      const placement = getTaskPlacement(results.task);

      Toast.show({
        type: "info",
        text1: results.task.title!,
        text2: mode === "edit" ? "Task updated" : getTaskScreenText(placement),
        props: {
          icon: "chevron.right",
          onPress: () =>
            mode === "edit"
              ? handleUpdateNavigation(taskId)
              : handleCreateNavigation(placement),
        },
      });

      dispatch(clearTaskState());
    } catch (error: unknown) {
      Toast.show({
        type: "error",
        text1:
          getErrorMessage(error, "Something went wrong.") ||
          "Failed to create task",
      });
    }
  };

  return (
    <SheetWrapper>
      <View style={styles.headerFormContainer}>
        <View style={styles.fields}>
          <TextInput
            autoFocus
            value={title || ""}
            onChangeText={(text) => {
              dispatch(setTitle({ title: text }));
            }}
            placeholder="Task title"
            placeholderTextColor="#a5a5a5"
            returnKeyType="next"
            style={styles.titleInput}
            blurOnSubmit={false}
            keyboardType="twitter"
          />
          <TextInput
            value={description || ""}
            onChangeText={(text) =>
              dispatch(setDescription({ description: text }))
            }
            placeholder="Description"
            placeholderTextColor="#a5a5a5"
            multiline
            style={styles.descriptionInput}
            textAlignVertical="top"
            keyboardType="twitter"
          />
        </View>
      </View>
      <View>
        <View collapsable={false}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={styles.scrollOverflow}
          >
            <View style={styles.row}>
              <Chip
                icon={status ? status.icon : "tag"}
                label={status ? status.label : "Status"}
                onPress={() => handleOpenTaskForm(routes.form_task_status.href)}
              />
              <Chip
                icon="calendar"
                label={startDateLabel}
                onPress={() => handleOpenTaskForm(routes.form_task_date.href)}
              />
              <Chip
                icon="calendar.badge.clock"
                label={deadline ? getDateLabel(deadline) : "Deadline"}
                onPress={() =>
                  handleOpenTaskForm(routes.form_task_deadline.href)
                }
              />
              <Chip
                icon="timer"
                label={durationLabel ?? "Duration"}
                onPress={() =>
                  handleOpenTaskForm(routes.form_task_duration.href)
                }
              />
              <Chip
                icon="repeat"
                label={getRepeatLabel(repeatValue)}
                onPress={() => handleOpenTaskForm(routes.form_task_repeat.href)}
              />
            </View>
          </ScrollView>
        </View>
        <View style={styles.actions}>
          <SelectProjectButton />
          <Pressable
            onPress={onSubmit}
            disabled={!title || loading}
            style={[
              styles.btnPrimary,
              { opacity: !title || loading ? 0.6 : 1 },
            ]}
          >
            {mode === "edit" ? (
              <SymbolView
                name="pencil.line"
                weight="medium"
                size={18}
                type="monochrome"
                tintColor="white"
              />
            ) : (
              <SymbolView
                name="plus"
                weight="medium"
                size={18}
                type="monochrome"
                tintColor="white"
              />
            )}
          </Pressable>
        </View>
      </View>
    </SheetWrapper>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#a5a5a5",
  },
  sheetBackground: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handle: {
    backgroundColor: "#bfbfbf",
  },
  content: {
    flex: 1,
  },
  headerFormContainer: {
    padding: 16,
  },
  fields: {
    marginTop: 16,
    gap: 10,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: "600",
    paddingVertical: 6,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
  },
  descriptionInput: {
    fontSize: 15,
    lineHeight: 20,
    paddingVertical: 6,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    minHeight: 80,
    opacity: 0.9,
    maxHeight: 130,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  btnPrimary: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#191919",
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    gap: 8,
    borderBottomColor: "#efefef",
    borderBottomWidth: 1,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  scrollOverflow: {
    overflow: "visible",
  },
});

export default TaskFormSheet;
