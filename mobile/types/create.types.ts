export const TASK_STATUS = ["next", "waiting", "someday"] as const;

export type TaskStatus = (typeof TASK_STATUS)[number];

export const isTaskStatus = (v: unknown): v is TaskStatus =>
  typeof v === "string" && (TASK_STATUS as readonly string[]).includes(v);

export const parseTaskStatus = (
  v: unknown,
  fallback: TaskStatus = "next",
): TaskStatus => (isTaskStatus(v) ? v : fallback);

export type ContainerIdType =
  | "container:today"
  | "container:inbox"
  | "container:plan"
  | "container:projects"
  | "container:plan:overdue"
  | "container:plan:inRange:next"
  | "container:plan:inRange:waiting"
  | "container:plan:inRange:someday";
