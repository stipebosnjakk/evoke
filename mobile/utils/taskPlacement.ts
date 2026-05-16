import { routes } from "@/constants/routes";
import { NewTask, Task } from "@/db";
import { getRepeatWeekdayIndex, toIsoDate } from "@/utils/date";
import { addDays, getUnixTime, startOfToday } from "date-fns";

type TaskScreen = "inbox" | "today" | "upcoming" | "none";

/**
 * Checks if a task is active (not completed and not deleted).
 * @param task
 * @returns
 */
const isActiveTask = (task: NewTask | Task): boolean =>
  !task.is_completed && !task.is_deleted;

/**
 * Checks if a task is planned.
 * @param task
 * @returns
 */
const isPlanned = (task: NewTask | Task): boolean =>
  Boolean(task.status) || Boolean(task.start_date) || Boolean(task.deadline);

/**
 * Checks if a task is in the inbox (active, and no scheduling information).
 * @param task
 * @returns
 */
export const isInboxTask = (task: NewTask | Task): boolean =>
  isActiveTask(task) && !task.start_date && !task.deadline && !task.status;

/**
 * Checks if a task is ready for today.
 * @param task
 * @returns
 */
export const isTodayTask = (
  task: NewTask | Task,
  todayDate = new Date(),
): boolean => {
  const today = toIsoDate(todayDate);
  const todayRepeatIndex = getRepeatWeekdayIndex(todayDate);
  const repeat = task.repeat ?? [];
  const repeatMatchesToday =
    repeat.length === 0 || repeat.includes(todayRepeatIndex);
  return (
    isActiveTask(task) &&
    !isInboxTask(task) &&
    task.status === "next" &&
    (!task.start_date || task.start_date <= today) &&
    repeatMatchesToday
  );
};

/**
 * Checks if a task is in the Upcoming (active, not in inbox, and planned).
 * @param task
 * @returns
 */
export const isUpcomingTask = (task: NewTask | Task): boolean =>
  isActiveTask(task) && !isInboxTask(task) && isPlanned(task);

/**
 * Decides which screen the task belongs to.
 * @param task
 * @returns
 */
export const getTaskPlacement = (task: NewTask): TaskScreen => {
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
export const isCompletedTodayTask = (task: NewTask | Task): boolean => {
  const completedAt = task.completed_at_utc;

  if (typeof completedAt !== "number") return false;

  const todayStart = getUnixTime(startOfToday());
  const tomorrowStart = getUnixTime(addDays(startOfToday(), 1));

  return (
    task.is_deleted !== true &&
    task.is_completed === true &&
    completedAt >= todayStart &&
    completedAt < tomorrowStart
  );
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
