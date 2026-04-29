import { routes } from "@/constants/routes";
import { NewTask } from "@/db";
import { toIsoDate } from "@/utils/date";

type TaskScreen = "inbox" | "today" | "plan" | "none";

/**
 * Checks if a task is active (not completed and not deleted).
 * @param task
 * @returns
 */
const isActiveTask = (task: NewTask): boolean =>
  task.completed_at == null && !task.is_deleted;

/**
 * Checks if a task has a destination (section, project, or area).
 * @param task
 * @returns
 */
const hasDestination = (task: NewTask): boolean =>
  Boolean(task.section_id || task.project_id || task.area_id);

/**
 * Checks if a task is planned (has a destination or scheduling information).
 * @param task
 * @returns
 */
const isPlanned = (task: NewTask): boolean =>
  hasDestination(task) ||
  Boolean(task.status) ||
  Boolean(task.start_date) ||
  Boolean(task.deadline);

/**
 * Checks if a task is in the inbox (active, has no destination, and no scheduling information).
 * @param task
 * @returns
 */
export const isInboxTask = (task: NewTask): boolean =>
  isActiveTask(task) &&
  !hasDestination(task) &&
  !task.start_date &&
  !task.deadline &&
  !task.status;

/**
 * Checks if a task is ready for today (active, not in inbox, status is "next" or null, and start date is today or earlier).
 * @param task
 * @returns
 */
export const isTodayTask = (task: NewTask): boolean => {
  const today = toIsoDate(new Date());

  return (
    isActiveTask(task) &&
    !isInboxTask(task) &&
    (task.status === "next" || task.status === null) &&
    (!task.start_date || task.start_date <= today)
  );
};

/**
 * Checks if a task is in the plan (active, not in inbox, and planned).
 * @param task
 * @returns
 */
export const isPlanTask = (task: NewTask): boolean =>
  isActiveTask(task) && !isInboxTask(task) && isPlanned(task);

/**
 * Decides which screen the task belongs to.
 * @param task
 * @returns
 */
export const getTaskPlacement = (task: NewTask): TaskScreen => {
  if (isInboxTask(task)) return "inbox";
  if (isTodayTask(task)) return "today";
  if (isPlanTask(task)) return "plan";
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
    case "plan":
      return "Added to Plan";
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
    case "plan":
      return routes.plan.href;
    case "none":
      return routes.inbox.href;
    default:
      return routes.inbox.href;
  }
};
