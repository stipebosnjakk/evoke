import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { ProjectsState, TasksState } from "@/types/initialState.types";
import {
  getActiveTasksAction,
  getProjectsAction,
} from "@/store/thunks/fetch.thunks";

export const addActiveTasksExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(getActiveTasksAction.pending, (state, _) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(getActiveTasksAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to load active tasks";
    })
    .addCase(getActiveTasksAction.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.tasks = action.payload.tasks;
      state.taskOrder.inbox = action.payload.inboxOrder;
    });
};

export const addProjectsExtraReducers = (
  builder: ActionReducerMapBuilder<ProjectsState>,
) => {
  builder
    .addCase(getProjectsAction.pending, (state, _) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(getProjectsAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to load projects";
    })
    .addCase(getProjectsAction.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.projects = action.payload.projects;
    });
};
