import { useEffect } from "react";
import {
  View,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useCalendars, useLocales } from "expo-localization";
import { SymbolView } from "expo-symbols";
import Toast from "react-native-toast-message";

import Chip from "@/components/ui/Chip";
import { useAppDispatch, useAppSelector } from "@/hooks/storeHooks";
import { createTaskAction } from "@/store/thunks/create.thunks";
import { getErrorMessage } from "@/utils/error";
import { routes } from "@/constants/routes";
import { formatTimeFromMin, getDateLabel, getRepeatLabel } from "@/utils/date";
import { STATUS_OPTIONS } from "@/constants/status";
import SheetWrapper from "@/components/wrappers/SheetWrapper";
import {
  clearTaskState,
  setDescription,
  setTitle,
} from "@/store/slices/newTask.slice";

const CreateTaskFormSheet = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const locales = useLocales();
  const calendars = useCalendars();

  const loading = useAppSelector((state) => state.newTask.loading);
  const title = useAppSelector((state) => state.newTask.inputs.title);
  const description = useAppSelector(
    (state) => state.newTask.inputs.description,
  );
  const startDate = useAppSelector((state) => state.newTask.task.start_date);
  const deadline = useAppSelector((state) => state.newTask.task.deadline);
  const statusValue = useAppSelector((state) => state.newTask.task.status);
  const repeatValue = useAppSelector((state) => state.newTask.task.repeat);
  const startTimeMin = useAppSelector(
    (state) => state.newTask.task.start_time_min,
  );
  const durationMin = useAppSelector(
    (state) => state.newTask.task.duration_min,
  );

  const status = STATUS_OPTIONS.find((s) => s.value === statusValue);
  const locale = locales[0]?.languageTag ?? "en-US";
  const is24Hour = calendars[0]?.uses24hourClock ?? false;

  const startTimeLabel = formatTimeFromMin(
    startTimeMin ?? null,
    locale,
    is24Hour,
  );

  const totalDurationMin =
    startTimeMin != null && durationMin != null
      ? startTimeMin + durationMin
      : null;
  const durationLabel = formatTimeFromMin(totalDurationMin, locale, is24Hour);

  useEffect(() => {
    return () => {
      dispatch(clearTaskState());
    };
  }, [dispatch]);

  const onSubmit = async () => {
    if (loading) return;
    try {
      await dispatch(createTaskAction()).unwrap();
    } catch (error: unknown) {
      showErrorToast(getErrorMessage(error, "Something went wrong."));
    }
  };

  const showErrorToast = (message: string) => {
    Toast.show({
      type: "error",
      text1: "Failed to create a task",
      text2: message || "Something went wrong.",
    });
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
                onPress={() => {
                  router.push(routes.create_task_status.href);
                }}
              />
              <Chip
                icon="calendar"
                label={
                  startDate
                    ? startTimeLabel
                      ? durationLabel
                        ? `${getDateLabel(startDate)} ${startTimeLabel} - ${durationLabel}`
                        : `${getDateLabel(startDate)} ${startTimeLabel}`
                      : `${getDateLabel(startDate)}`
                    : "Date"
                }
                onPress={() => {
                  router.push(routes.create_task_date.href);
                }}
              />
              <Chip
                icon="calendar.badge.clock"
                label={deadline ? getDateLabel(deadline) : "Deadline"}
                onPress={() => {
                  router.push(routes.create_task_deadline.href);
                }}
              />
              <Chip
                icon="repeat"
                label={getRepeatLabel(repeatValue)}
                onPress={() => {
                  router.push(routes.create_task_repeat.href);
                }}
              />
            </View>
          </ScrollView>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.projectSelector}
            onPress={() => {
              router.push(routes.create_task_project.href);
            }}
          >
            <SymbolView
              name="folder"
              size={20}
              type="monochrome"
              tintColor="#6B6B6B"
            />
            <Text
              style={styles.projectSelectorText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              Select project
            </Text>
            <SymbolView name="chevron.down" size={13} tintColor="#6B6B6B" />
          </TouchableOpacity>
          <Pressable
            onPress={onSubmit}
            disabled={!title || loading}
            style={[
              styles.btnPrimary,
              { opacity: !title || loading ? 0.6 : 1 },
            ]}
          >
            <SymbolView
              name="plus"
              weight="medium"
              size={18}
              type="monochrome"
              tintColor="white"
            />
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
  projectSelector: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 12,
    marginRight: 16,
    paddingVertical: 12,
  },
  projectSelectorText: {
    flexShrink: 1,
    minWidth: 0,
    fontSize: 13,
    lineHeight: 28,
    fontWeight: "500",
    color: "#6B6B6B",
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

export default CreateTaskFormSheet;
