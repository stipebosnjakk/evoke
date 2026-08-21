import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ScrollView,
  Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SymbolView } from "expo-symbols";

import { useAppSelector } from "@/hooks/storeHooks";
import { selectTaskById } from "@/store/selectors/task.selector";
import { routes } from "@/constants/routes";
import { STATUS_OPTIONS } from "@/constants/status";
import { isBefore, parseISO, startOfToday } from "date-fns";
import {
  formatTimeFromMin,
  getDateLabel,
  getDurationLabel,
  getRepeatLabel,
} from "@/utils/date";
import { useCalendars, useLocales } from "expo-localization";
import SheetWrapper from "@/components/wrappers/SheetWrapper";
import CompleteTask from "@/components/task/CompleteTask";
import { getUpcomingTaskDate } from "@/utils/taskPlacement";
import Chip from "@/components/custom/Chip";
import TaskMenu from "@/components/task/TaskMenu";

type LocalSearchParamsType = {
  taskId?: string;
};

type ChipType = {
  id: string;
  onPress: () => void;
  label: string;
  icon: string;
};

const TaskScreen = () => {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const locales = useLocales();
  const calendars = useCalendars();

  const locale = locales[0]?.languageTag ?? "en-US";
  const is24Hour = calendars[0]?.uses24hourClock ?? false;

  const { taskId } = useLocalSearchParams<LocalSearchParamsType>();

  const task = useAppSelector((state) =>
    taskId ? selectTaskById(state, taskId) : undefined,
  );

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [descriptionNeedsExpansion, setDescriptionNeedsExpansion] =
    useState(false);
  const [hasMeasuredDescription, setHasMeasuredDescription] = useState(false);

  const description = task?.description?.trim() ?? "";

  useEffect(() => {
    setIsDescriptionExpanded(false);
    setDescriptionNeedsExpansion(false);
    setHasMeasuredDescription(false);
  }, [description]);

  useEffect(() => {
    if (!task) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace(routes.today.href);
      }
    }
  }, [task, router]);

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push(routes.today.href);
    }
  };

  if (!task) return null;

  const handleDescriptionOnPress = () => {
    setIsDescriptionExpanded((current) => !current);
    router.push({
      pathname: routes.form_task_inputs.href,
      params: {
        taskId: task?.id,
        editInput: "description",
      },
    });
  };

  const addDetails: ChipType[] = [];
  const meta: ChipType[] = [];

  if (task.project) {
    meta.push({
      id: "project",
      icon: "folder",
      label: task.project.name,
      onPress: () => {
        if (!task.project) return;

        router.replace({
          pathname: routes.single_project.href,
          params: {
            projectId: task.project.id,
          },
        });
      },
    });
  } else {
    addDetails.push({
      id: "project",
      icon: "folder",
      label: "Select project",
      onPress: () =>
        router.push({
          pathname: routes.form_task_project.href,
          params: {
            taskId: task.id,
            scope: "field",
          },
        }),
    });
  }

  if (task.status) {
    const status =
      STATUS_OPTIONS.find((option) => option.value === task.status) ?? null;

    if (!status) {
      addDetails.push({
        id: "status",
        icon: "tag",
        label: "Status",
        onPress: () =>
          router.push({
            pathname: routes.form_task_status.href,
            params: {
              taskId: task.id,
              scope: "field",
            },
          }),
      });
      return;
    }

    meta.push({
      id: "status",
      icon: status.icon,
      label: status.label,
      onPress: () =>
        router.push({
          pathname: routes.form_task_status.href,
          params: {
            taskId: task.id,
            scope: "field",
          },
        }),
    });
  } else {
    addDetails.push({
      id: "status",
      icon: "tag",
      label: "Status",
      onPress: () =>
        router.push({
          pathname: routes.form_task_status.href,
          params: {
            taskId: task.id,
            scope: "field",
          },
        }),
    });
  }

  if (task.start_date) {
    const prefix = isBefore(parseISO(task.start_date), startOfToday())
      ? "Started"
      : "Starts";

    meta.push({
      id: "start_date",
      icon: "calendar",
      label: `${prefix} ${getDateLabel(task.start_date)}`,
      onPress: () =>
        router.push({
          pathname: routes.form_task_date.href,
          params: {
            taskId: task.id,
            scope: "field",
          },
        }),
    });
  } else {
    addDetails.push({
      id: "start_date",
      icon: "calendar",
      label: "Date",
      onPress: () =>
        router.push({
          pathname: routes.form_task_date.href,
          params: {
            taskId: task.id,
            scope: "field",
          },
        }),
    });
  }

  if (task.deadline) {
    meta.push({
      id: "deadline",
      icon: "calendar.badge.clock",
      label: `Due ${getDateLabel(task.deadline)}`,
      onPress: () =>
        router.push({
          pathname: routes.form_task_deadline.href,
          params: {
            taskId: task.id,
            scope: "field",
          },
        }),
    });
  } else {
    addDetails.push({
      id: "deadline",
      icon: "calendar.badge.clock",
      label: "Deadline",
      onPress: () =>
        router.push({
          pathname: routes.form_task_deadline.href,
          params: {
            taskId: task.id,
            scope: "field",
          },
        }),
    });
  }

  if (task.start_date || task.repeat) {
    if (task.start_time_min) {
      const time = formatTimeFromMin(task.start_time_min, locale, is24Hour);

      meta.push({
        id: "time",
        icon: "clock",
        label: time ?? "Time",
        onPress: () =>
          router.push({
            pathname: routes.form_task_time.href,
            params: {
              taskId: task.id,
              scope: "field",
            },
          }),
      });
    } else {
      addDetails.push({
        id: "time",
        icon: "clock",
        label: "Time",
        onPress: () =>
          router.push({
            pathname: routes.form_task_time.href,
            params: {
              taskId: task.id,
              scope: "field",
            },
          }),
      });
    }
  }

  if (task.duration_min) {
    const label = getDurationLabel(task.duration_min);

    meta.push({
      id: "duration",
      icon: "timer",
      label,
      onPress: () =>
        router.push({
          pathname: routes.form_task_duration.href,
          params: {
            taskId: task.id,
            scope: "field",
          },
        }),
    });
  } else {
    addDetails.push({
      id: "duration",
      icon: "timer",
      label: "Duration",
      onPress: () =>
        router.push({
          pathname: routes.form_task_duration.href,
          params: {
            taskId: task.id,
            scope: "field",
          },
        }),
    });
  }

  if (task.repeat?.length) {
    meta.push({
      id: "repeat",
      icon: "repeat",
      label: getRepeatLabel(task.repeat),
      onPress: () =>
        router.push({
          pathname: routes.form_task_repeat.href,
          params: {
            taskId: task.id,
            scope: "field",
          },
        }),
    });
  } else {
    addDetails.push({
      id: "repeat",
      icon: "repeat",
      label: "Repeat",
      onPress: () =>
        router.push({
          pathname: routes.form_task_repeat.href,
          params: {
            taskId: task.id,
            scope: "field",
          },
        }),
    });
  }

  return (
    <SheetWrapper>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.headerSide} onPress={handleGoBack}>
          <SymbolView
            name="xmark"
            weight="medium"
            size={20}
            type="monochrome"
            tintColor="rgb(67, 67, 67)"
          />
        </TouchableOpacity>
        <TaskMenu task={task} />
      </View>
      <View style={styles.contentContainer}>
        <CompleteTask
          task={task}
          variant="detail"
          isPreview={
            Boolean(task.repeat?.length) && getUpcomingTaskDate(task) !== null
          }
        />
        {meta.length > 0 && (
          <View style={styles.metaWrapper}>
            {meta.map((info) => (
              <TouchableOpacity
                key={info.id}
                style={styles.metaContainer}
                onPress={info.onPress}
                activeOpacity={0.7}
                disabled={!info.onPress}
              >
                <SymbolView
                  name={info.icon as any}
                  size={14}
                  weight="medium"
                  tintColor="#71717A"
                />
                <Text style={styles.metaText} numberOfLines={1}>
                  {info.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <Pressable
          style={styles.descriptionContainer}
          onPress={handleDescriptionOnPress}
        >
          {description ? (
            <>
              <Text
                style={[
                  styles.descriptionText,
                  !hasMeasuredDescription && styles.descriptionMeasuring,
                ]}
                numberOfLines={
                  hasMeasuredDescription && !isDescriptionExpanded
                    ? 2
                    : undefined
                }
                onTextLayout={({ nativeEvent }) => {
                  if (hasMeasuredDescription) return;
                  setDescriptionNeedsExpansion(nativeEvent.lines.length > 2);
                  setHasMeasuredDescription(true);
                }}
              >
                {description}
              </Text>
              {hasMeasuredDescription && descriptionNeedsExpansion && (
                <TouchableOpacity
                  onPress={() => {
                    setIsDescriptionExpanded((current) => !current);
                  }}
                  activeOpacity={0.7}
                  style={styles.descriptionToggle}
                >
                  <Text style={styles.descriptionToggleText}>
                    {isDescriptionExpanded ? "Show less" : "Show more"}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.emptyDescriptionText}>No description</Text>
          )}
        </Pressable>
      </View>
      {addDetails.length > 0 && (
        <View style={styles.detailsSection}>
          <Text style={styles.detailsTitle}>Add more details</Text>
          <View style={styles.chipsViewport} collapsable={false}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.row}
            >
              {addDetails.map((detail) => (
                <Chip
                  key={detail.id}
                  icon={detail.icon}
                  label={detail.label}
                  onPress={detail.onPress}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </SheetWrapper>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  headerSide: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
    backgroundColor: "#F2F2F2",
  },
  contentContainer: {
    paddingTop: 20,
    paddingHorizontal: 20,
    flexDirection: "column",
    gap: 20,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  metaWrapper: {
    gap: 20,
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "#E4E4E7",
    borderRadius: 9,
    backgroundColor: "#FAFAFA",
  },
  metaText: {
    color: "#52525B",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "500",
  },
  descriptionContainer: {
    width: "100%",
    gap: 6,
  },
  descriptionText: {
    color: "#52525B",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "400",
  },
  descriptionMeasuring: {
    opacity: 0,
  },
  descriptionToggle: {
    alignSelf: "flex-start",
  },
  descriptionToggleText: {
    color: "#71717A",
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "600",
  },
  emptyDescriptionText: {
    color: "#A1A1AA",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    fontStyle: "italic",
  },
  detailsSection: {
    width: "100%",
    gap: 10,
    marginTop: 40,
  },
  detailsTitle: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "600",
    color: "#8C8C87",
    marginLeft: 20,
  },
  chipsViewport: {
    alignSelf: "stretch",
  },
  row: {
    alignItems: "flex-start",
    gap: 8,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
});

export default TaskScreen;
