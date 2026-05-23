import type { Task, NewTask, NewProject, Project } from "@/db";
import { ProjectColor } from "@/types/project.types";
import { UserConfig } from "@/types/config.types";

export type Status = "idle" | "loading" | "succeeded" | "failed";

export type ScreenInfo = {
  status: Status;
  error: string | null;
};

export type EntityObjectType<TItem> = {
  ids: string[];
  byId: Record<string, TItem>;
};

export type OrderObject = Record<string, number>;

export type TasksState = ScreenInfo & {
  tasks: EntityObjectType<Task>;
  taskOrder: {
    inbox: OrderObject;
  };
};

export type ProjectsState = ScreenInfo & {
  projects: EntityObjectType<Project>;
  projectOrder: {
    main: OrderObject;
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

export type UserState = ScreenInfo & {
  config: UserConfig | null;
};

export type NewProjectStateFields = {
  name: string | null;
  color: ProjectColor;
};

export type NewProjectInitialState = {
  loading: boolean;
  error: string | null;
  project: NewProject;
};

export type ValidationResult<T> =
  | {
      ok: true;
      data: T;
      message: string;
    }
  | {
      ok: false;
      data: null;
      message: string;
    };
