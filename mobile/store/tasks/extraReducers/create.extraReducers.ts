import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { TasksState } from "@/types/initialState.types";
import { createTaskAction } from "@/store/tasks/thunks/create.thunks";
import {
  isInboxTask,
  isPlanTask,
  isTodayTask,
} from "@/store/tasks/utils/routing";

export const addCreationExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(createTaskAction.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createTaskAction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to create task";
    })
    .addCase(createTaskAction.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;

      const { task } = action.payload;

      if (!task) {
        state.error = "Failed to create task";
        return;
      }

      state.tasks.byId[task.id] = task;

      if (isInboxTask(task)) {
        const exists = state.lists.inbox.ids.some((x) => x.id === task.id);
        if (!exists) {
          state.lists.inbox.ids.unshift({
            id: task.id,
            order_key: task.order_key,
          });
        }
      }

      if (isTodayTask(task)) {
        const exists = state.lists.today.ids.some((x) => x.id === task.id);
        if (!exists) {
          state.lists.today.ids.unshift({
            id: task.id,
            order_key: task.order_key,
          });
        }
      }

      if (isPlanTask(task)) {
        // TODO: Check functionality for in range and overdue tasks
        // I think we should have maybe each range ids (next, week, month,.. - ids)
      }
    });
};
