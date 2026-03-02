import { type Task } from "@/db";
import { TASK_STATUSES } from "@/utils/consts";

export const TASK_STATUS = ["next", "waiting", "someday"] as const;
export type TaskStatus = "next" | "someday" | "waiting";

export type TaskStatusOption = (typeof TASK_STATUSES)[number];

export type ContainerIdType =
  | "container:today"
  | "container:inbox"
  | "container:plan"
  | "container:projects"
  | "container:plan:overdue"
  | "container:plan:inRange:next"
  | "container:plan:inRange:waiting"
  | "container:plan:inRange:someday";

export type TaskWithOrderKey = Task & {
  order_key: number;
};

export type DataReturnType = {
  data: TaskWithOrderKey[];
  total: number;
};

export type RejectWithValue = {
  message: string | null;
};

export type OrderTaskItem = {
  id: string;
  order_key: number;
};
