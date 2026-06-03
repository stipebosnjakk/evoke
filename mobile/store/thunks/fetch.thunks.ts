import { createAsyncThunk } from "@reduxjs/toolkit";

import { RejectWithValue, TaskStateData } from "@/types/task.types";
import { getErrorMessage } from "@/utils/error";
import { INBOX_SCOPE_ID } from "@/constants/scopeIds";
import { Project } from "@/db/schemas/project.schema";
import { OrderObject, EntityObjectType } from "@/types/initialState.types";
import {
  fetchActiveTasks,
  fetchProjects,
  fetchScopeOrder,
} from "@/db/repositories/fetch.repo";

type ActiveTasksType = {
  tasks: EntityObjectType<TaskStateData>;
  inboxOrder: OrderObject;
};

export const getActiveTasksAction = createAsyncThunk<
  ActiveTasksType,
  { refresh?: boolean },
  { rejectValue: RejectWithValue }
>("tasks/fetchActiveTasks", async (_, { rejectWithValue }) => {
  try {
    const [tasks, inboxOrder] = await Promise.all([
      fetchActiveTasks(),
      fetchScopeOrder(INBOX_SCOPE_ID),
    ]);
    return { tasks, inboxOrder };
  } catch (error: unknown) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to get active tasks"),
    });
  }
});

type ProjectsType = {
  projects: EntityObjectType<Project>;
};

export const getProjectsAction = createAsyncThunk<
  ProjectsType,
  void,
  { rejectValue: RejectWithValue }
>("projects/fetchProjects", async (_, { rejectWithValue }) => {
  try {
    const projects = await fetchProjects();
    return { projects };
  } catch (error: unknown) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to get projects"),
    });
  }
});
