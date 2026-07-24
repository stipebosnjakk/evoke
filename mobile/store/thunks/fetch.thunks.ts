import { createAsyncThunk } from "@reduxjs/toolkit";

import { RejectWithValue, TaskStateData } from "@/types/task.types";
import { getErrorMessage } from "@/utils/error";
import { INBOX_SCOPE_ID } from "@/constants/scopeIds";
import { OrderObject, EntityObjectType } from "@/types/initialState.types";
import {
  fetchActiveTasksRepo,
  fetchProjectsRepo,
  fetchScopeOrderRepo,
  SearchResults,
  searchTasksAndProjectsRepo,
} from "@/db/repositories/fetch.repo";
import { ProjectStateData } from "@/types/project.types";

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
      fetchActiveTasksRepo(),
      fetchScopeOrderRepo(INBOX_SCOPE_ID),
    ]);
    return { tasks, inboxOrder };
  } catch (error: unknown) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to get active tasks"),
    });
  }
});

type ProjectsType = {
  projects: EntityObjectType<ProjectStateData>;
};

export const getProjectsAction = createAsyncThunk<
  ProjectsType,
  void,
  { rejectValue: RejectWithValue }
>("projects/fetchProjects", async (_, { rejectWithValue }) => {
  try {
    const projects = await fetchProjectsRepo();
    return { projects };
  } catch (error: unknown) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to get projects"),
    });
  }
});

export const searchTasksAndProjectsAction = createAsyncThunk<
  SearchResults,
  string,
  { rejectValue: RejectWithValue }
>("search/searchTasksAndProjects", async (searchQuery, { rejectWithValue }) => {
  try {
    const search = await searchTasksAndProjectsRepo(searchQuery);
    return search;
  } catch (error: unknown) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to search tasks and projects"),
    });
  }
});
