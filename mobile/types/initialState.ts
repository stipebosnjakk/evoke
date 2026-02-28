import { Task } from "@/db";
import { ContainerIdType } from "@/types/create.types";
import { OrderTaskItem } from "@/types/task.types";

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
