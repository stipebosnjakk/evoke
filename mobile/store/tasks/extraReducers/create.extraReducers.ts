import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { TasksState } from "@/types/initialState.types";
import { createTaskAction } from "@/store/tasks/thunks/create.thunks";

export const addCreationExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(createTaskAction.pending, (state, _) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(createTaskAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to create task";
    })
    .addCase(createTaskAction.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;

      const { task, order_key } = action.payload;

      if (!task) {
        state.error = "Failed to create task";
        return;
      }

      if (!state.tasks.ids.includes(task.id)) {
        state.tasks.ids.push(task.id);
      }

      if (order_key !== null) {
        state.taskOrder.inbox[task.id] = order_key;
      }

      state.tasks.byId[task.id] = task;
    });
};
