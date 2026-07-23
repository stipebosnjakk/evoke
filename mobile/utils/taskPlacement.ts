import { routes } from "@/constants/routes";
import { NewTask } from "@/db";
import { IsoDate, TaskStateData } from "@/types/task.types";
import {
  getNextRepeatDate,
  getRepeatWeekdayIndex,
  toIsoDate,
} from "@/utils/date";
import { parseISO, startOfToday } from "date-fns";

type TaskScreen = "inbox" | "today" | "upcoming" | "none";

/**
 * Checks if a task is active (not completed).
 * @param task
 * @returns
 */
export const isActiveTask = (task: TaskStateData | NewTask): boolean =>
  !task.is_completed;

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

/**
 * Finds the next day the task should show in Upcoming.
 *
 * @param task The task to check
 * @returns The next date, or null
 */
export const getUpcomingTaskDate = (task: TaskStateData): IsoDate | null => {
  const todayDate = startOfToday();
  const today = toIsoDate(todayDate);

  if (!isActiveTask(task) || isInboxTask(task)) return null;
  if (task.status !== "next") return null;

  if (task.repeat?.length) {
    const fromDate =
      task.start_date && task.start_date > today
        ? parseISO(task.start_date)
        : todayDate;

    const calculatingFromToday = toIsoDate(fromDate) === today;

    const includeFromDate =
      !calculatingFromToday || task.repeat_today_status !== "completed_today";

    const nextRepeatDate = getNextRepeatDate(
      task.repeat,
      fromDate,
      includeFromDate,
    );

    return nextRepeatDate && nextRepeatDate > today ? nextRepeatDate : null;
  }

  if (task.start_date) {
    return task.start_date > today ? task.start_date : null;
  }

  return task.deadline && task.deadline > today ? task.deadline : null;
};
