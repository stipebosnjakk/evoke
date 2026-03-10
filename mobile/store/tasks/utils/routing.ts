import { TaskWithOrderKey } from "@/types/task.types";

export const isInboxTask = (task: TaskWithOrderKey) => {
  if (task.is_deleted) return false;
  if (task.completed_at != null) return false;

  const noDestination =
    task.area_id == null && task.project_id == null && task.section_id == null;

  const noDates =
    task.start_date == null &&
    task.start_time_min == null &&
    task.due_time_min == null &&
    task.deadline == null &&
    task.repeat == null;

  if (noDestination && noDates && task.status == null) return true;

  return false;
};

export const isTodayTask = (task: TaskWithOrderKey) => {
  if (isInboxTask(task)) return false;
  if (task.is_deleted) return false;
  if (task.completed_at != null) return false;
  if (task.status !== "next") return false;
  if (task.start_date == null) return true;

  const today = new Date();
  const start = new Date(task.start_date + "T00:00:00");
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  return start <= todayStart;
};

export const isPlanTask = (task: TaskWithOrderKey) => {
  if (task.is_deleted) return false;
  if (task.completed_at != null) return false;
  if (isInboxTask(task)) return false;
  return true;
};
