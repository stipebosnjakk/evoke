import type { Task } from "@/db";
import {
  OrderTaskItem,
  ContainerIdType,
  TaskStatusOptionsArray,
  TaskWithOrderKey,
} from "@/types/task.types";

// TODO: maybe replace this type with IsoType from task types
type ErrorType = string | null;
type ISODate = string;

type PlanPreset = "next7" | "next30" | "week" | "month" | "custom";
type PlanStatusKey = "next" | "waiting" | "someday";

type PlanRange = {
  preset: PlanPreset;
  startDate: ISODate | null;
  endDate: ISODate | null;
};

export type PagedIdList = {
  ids: OrderTaskItem[];
  loading: boolean;
  error: ErrorType;
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
};

type PlanState = {
  range: PlanRange;
  overdue: PagedIdList;
  inRange: Record<PlanStatusKey, PagedIdList>;
};

export type TasksState = {
  loading: boolean;
  error: ErrorType;
  containerId: ContainerIdType | null;
  ui: {
    searchQuery: string;
  };
  tasks: {
    byId: Record<string, Task>;
  };
  lists: {
    today: PagedIdList;
    inbox: PagedIdList;
    plan: PlanState;
  };
};

export type NewTaskType = {
  title: string | null;
  description: string | null;
  status: TaskStatusOptionsArray | null;
  start_date: string | null;
  start_time_min: number | null;
  due_time_min: number | null;
  deadline: string | null;
  repeat: string | null;
};

export type NewTaskInitialState = {
  loading: boolean;
  error: string | null;
  inputs: {
    title: string | null;
    description: string | null;
  };
  task: TaskWithOrderKey;
};
