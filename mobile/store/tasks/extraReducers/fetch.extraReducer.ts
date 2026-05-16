import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { TasksState } from "@/types/initialState.types";
import { getActiveTasksAction } from "@/store/tasks/thunks/fetch.thunks";

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
