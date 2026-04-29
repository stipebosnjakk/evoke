import { routes } from "@/constants/routes";
import { NewTask } from "@/db";
import { toIsoDate } from "@/utils/date";

export type TaskScreen = "inbox" | "today" | "plan" | "none";

const isActiveTask = (task: NewTask): boolean =>
  task.completed_at == null && !task.is_deleted;

const hasDestination = (task: NewTask): boolean =>
  Boolean(task.section_id || task.project_id || task.area_id);

const isPlanned = (task: NewTask): boolean =>
  hasDestination(task) ||
  Boolean(task.status) ||
  Boolean(task.start_date) ||
  Boolean(task.deadline);

export const isInboxTask = (task: NewTask): boolean =>
  isActiveTask(task) &&
  !hasDestination(task) &&
  !task.start_date &&
  !task.deadline &&
  !task.status;

export const isTodayTask = (task: NewTask): boolean => {
  const today = toIsoDate(new Date());

  return (
    isActiveTask(task) &&
    !isInboxTask(task) &&
    (task.status === "next" || task.status === null) &&
    (!task.start_date || task.start_date <= today)
  );
};

export const isPlanTask = (task: NewTask): boolean =>
  isActiveTask(task) && !isInboxTask(task) && isPlanned(task);

export const getTaskPlacement = (task: NewTask): TaskScreen => {
  if (isInboxTask(task)) return "inbox";
  if (isTodayTask(task)) return "today";
  if (isPlanTask(task)) return "plan";
  return "none";
};

export const getTaskScreenText = (screen: TaskScreen): string => {
  switch (screen) {
    case "inbox":
      return "Captured in Inbox";
    case "today":
      return "Added to Today";
    case "plan":
      return "Added to Plan";
    case "none":
      return "Task created";
    default:
      return "Task created";
  }
};

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
