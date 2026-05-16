import type { Task, NewTask } from "@/db";
import { ScopeGroupId, ScopeScreenId } from "./task.types";

export type Status = "idle" | "loading" | "succeeded" | "failed";

export type ScopeType = Record<string, number>;

export type TasksObjectType = {
  ids: string[];
  byId: Record<string, Task>;
};

export type TasksState = {
  status: Status;
  error: string | null;
  tasks: TasksObjectType;
  taskOrder: {
    inbox: ScopeType;
  };
};

export type NewTaskInitialState = {
  loading: boolean;
  error: string | null;
  inputs: {
    title: string | null;
    description: string | null;
  };
  task: NewTask;
};

export type UserTheme = "light" | "dark" | "system";

export type GroupByIdType = Partial<
  Record<ScopeGroupId, { title: string; tasks: Task[] }>
>;

export type GroupConfig = {
  id: ScopeGroupId;
  order_key: number;
  isOpen: boolean;
};

export type ViewType = "group" | "list" | null;

export type ScreenConfig = {
  view: ViewType;
  group_order: GroupConfig[];
};

export type UserConfig = {
  theme: UserTheme;
  screens: Record<ScopeScreenId, ScreenConfig>;
};

export type UserState = {
  config: UserConfig | null;
  status: Status;
  error: string | null;
};
