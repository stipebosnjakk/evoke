import { routes } from "@/constants/routes";
import { NewTask } from "@/db";
import { TaskStateData } from "@/types/task.types";
import {
  getRepeatWeekdayIndex,
  getUpcomingTaskDate,
  toIsoDate,
} from "@/utils/date";
import { addDays, getUnixTime, startOfToday } from "date-fns";

type TaskScreen = "inbox" | "today" | "upcoming" | "none";

/**
 * Checks if a task is active (not completed and not deleted).
 * @param task
 * @returns
 */
export const isActiveTask = (task: TaskStateData | NewTask): boolean =>
  !task.is_completed && !task.is_deleted;

/**
 * Checks if a task is in the inbox (active, and no scheduling information).
 * @param task
 * @returns
 */
export const isInboxTask = (task: TaskStateData | NewTask): boolean =>
  isActiveTask(task) &&
  !task.start_date &&
  !task.deadline &&
  !task.status &&
  !task.repeat;

/**
 * Checks if a task is ready for today.
 * @param task
 * @returns
 */
export const isTodayTask = (task: TaskStateData): boolean => {
  const todayDate = startOfToday();
  const today = toIsoDate(todayDate);
  const todayRepeatIndex = getRepeatWeekdayIndex(todayDate);

  const repeat = task.repeat ?? [];
  const isRepeating = repeat.length > 0;

  const isScheduledToday = !isRepeating || repeat.includes(todayRepeatIndex);

  const isNotCompletedToday =
    !isRepeating || task.repeat_today_status === "not_completed_today";

  return (
    isActiveTask(task) &&
    !isInboxTask(task) &&
    task.status === "next" &&
    (!task.start_date || task.start_date <= today) &&
    isScheduledToday &&
    isNotCompletedToday
  );
};

/**
 * Checks if a task is in the Upcoming (active, not in inbox, and planned).
 * @param task
 * @returns
 */
export const isUpcomingTask = (task: TaskStateData): boolean => {
  if (!isActiveTask(task) || isInboxTask(task)) return false;

  if (task.status === "waiting" || task.status === "someday") {
    return true;
  }

  return getUpcomingTaskDate(task) !== null;
};

/**
 * Decides which screen the task belongs to.
 * @param task
 * @returns
 */
export const getTaskPlacement = (task: TaskStateData): TaskScreen => {
  if (isInboxTask(task)) return "inbox";
  if (isTodayTask(task)) return "today";
  if (isUpcomingTask(task)) return "upcoming";
  return "none";
};

/**
 * Checks if a task was completed today.
 * @param task
 * @returns
 */
export const isCompletedTodayTask = (task: TaskStateData): boolean => {
  if (task.is_deleted) return false;

  const isRepeatingCompletedToday =
    Boolean(task.repeat?.length) &&
    task.repeat_today_status === "completed_today";

  const completedAt = task.completed_at_utc;

  const isPermanentlyCompletedToday =
    task.is_completed === true &&
    typeof completedAt === "number" &&
    completedAt >= getUnixTime(startOfToday()) &&
    completedAt < getUnixTime(addDays(startOfToday(), 1));

  return isRepeatingCompletedToday || isPermanentlyCompletedToday;
};

/**
 * Returns the text for a given task screen.
 * @param screen
 * @returns
 */
export const getTaskScreenText = (screen: TaskScreen): string => {
  switch (screen) {
    case "inbox":
      return "Captured in Inbox";
    case "today":
      return "Ready for Today";
    case "upcoming":
      return "Added to Upcoming";
    case "none":
      return "Task created";
    default:
      return "Task created";
  }
};

/**
 * Returns the href for a given task screen.
 * @param screen
 * @returns
 */
export const getTaskScreenHref = (screen: TaskScreen): string => {
  switch (screen) {
    case "inbox":
      return routes.inbox.href;
    case "today":
      return routes.today.href;
    case "upcoming":
      return routes.upcoming.href;
    case "none":
      return routes.inbox.href;
    default:
      return routes.inbox.href;
  }
};
