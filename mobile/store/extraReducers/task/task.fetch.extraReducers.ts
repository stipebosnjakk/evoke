import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { TasksState } from "@/types/initialState.types";
import { fetchActiveTasksAction } from "@/store/thunks/task/task.fetch.thunks";

export const addFetchActiveTasksExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(fetchActiveTasksAction.pending, (state, _) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(fetchActiveTasksAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to load active tasks";
    })
    .addCase(fetchActiveTasksAction.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.tasks = action.payload.tasks;
      state.taskOrder.inbox = action.payload.inboxOrder;
    });
};
