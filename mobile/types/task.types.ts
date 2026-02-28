import { type Task } from "@/db";

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
