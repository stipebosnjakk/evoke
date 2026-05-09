import type { Task, NewTask } from "@/db";

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
