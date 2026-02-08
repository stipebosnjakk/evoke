import { Task } from "@/db";

export const TASK_STATUS = ["next", "waiting", "someday"] as const;

export type TaskStatus = (typeof TASK_STATUS)[number];

export const isTaskStatus = (v: unknown): v is TaskStatus =>
  typeof v === "string" && (TASK_STATUS as readonly string[]).includes(v);

export const parseTaskStatus = (
  v: unknown,
  fallback: TaskStatus = "next",
): TaskStatus => (isTaskStatus(v) ? v : fallback);

type ID = string;
type ListError = string | null;
type ISODate = string;

type ActiveView = "Today" | "Inbox" | "Plan" | null;
type PlanPreset = "next7" | "next30" | "week" | "month" | "custom";
type PlanStatusKey = "next" | "waiting" | "someday";

type PagedIdList = {
  ids: ID[];
  loading: boolean;
  error: ListError;
  limit: number;
  offset: number;
  total: number;
  hasMore: boolean;
};

type PlanRange = {
  preset: PlanPreset;
  startDate: ISODate | null;
  endDate: ISODate | null;
};

type PlanState = {
  range: PlanRange;
  overdue: PagedIdList;
  inRange: Record<PlanStatusKey, PagedIdList>;
};

export type TasksState = {
  loading: boolean;
  error: ListError;
  ui: {
    activeView: ActiveView;
    searchQuery: string;
  };
  tasks: {
    byId: Record<ID, Task>;
  };
  lists: {
    today: PagedIdList;
    inbox: PagedIdList;
    plan: PlanState;
  };
};
