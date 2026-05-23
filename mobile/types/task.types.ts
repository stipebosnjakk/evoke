import { STATUS_OPTIONS } from "@/constants/status";
import type { Task } from "@/db";

export type TaskStatusOptionsArray = {
  label: string;
  value: TaskStatus;
  icon: string;
};

export type TaskStatus = "next" | "waiting" | "someday";
// TODO: check this type
export type TaskStatusOption = (typeof STATUS_OPTIONS)[number];

export type TaskWithOrderKey = {
  task: Task;
  order_key: number | null;
};
export type RejectWithValue = {
  message: string | null;
};

export type OrderTaskItem = {
  id: string;
  order_key: number;
};

export type IsoDate = `${number}-${number}-${number}`;

export type DateValueType = "start_date" | "deadline";

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

