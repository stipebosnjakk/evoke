import type { FormTask, FormProject } from "@/db";
import { ProjectColor, ProjectStateData } from "@/types/project.types";
import { UserConfig } from "@/types/config.types";
import { TaskStateData } from "./task.types";

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
  tasks: EntityObjectType<TaskStateData>;
  taskOrder: {
    inbox: OrderObject;
  };
};

export type ProjectsState = ScreenInfo & {
  projects: EntityObjectType<ProjectStateData>;
  projectOrder: {
    main: OrderObject;
  };
};

export type FormTaskInitialState = {
  loading: boolean;
  error: string | null;
  inputs: {
    title: string | null;
    description: string | null;
  };
  task: FormTask;
};

export type UserState = ScreenInfo & {
  config: UserConfig | null;
};

export type FormProjectStateFields = {
  name: string | null;
  color: ProjectColor;
};

export type FormProjectInitialState = {
  loading: boolean;
  error: string | null;
  project: FormProject;
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
