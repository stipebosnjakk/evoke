import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { TasksState } from "@/types/initialState.types";
import {
  completeTaskAction,
  rebalanceOrderKeysAction,
  restoreCompletedTaskAction,
  updateTaskOrderKeyAction,
} from "@/store/thunks/update.thunks";
import { INBOX_SCOPE_ID } from "@/constants/scopeIds";

export const addReorderExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(updateTaskOrderKeyAction.pending, (state, action) => {
      state.error = null;
      const { newOrder, scopeId } = action.meta.arg;
      if (scopeId === INBOX_SCOPE_ID) {
        state.taskOrder.inbox[newOrder.id] = newOrder.order_key;
      }
    })
    .addCase(updateTaskOrderKeyAction.rejected, (state, action) => {
      state.error =
        action.payload?.message || "Failed to update task order key";
    })
    .addCase(updateTaskOrderKeyAction.fulfilled, (state, _) => {
      state.error = null;
    })
    .addCase(rebalanceOrderKeysAction.pending, (state, action) => {
      state.error = null;
      const { orderArray, scopeId } = action.meta.arg;
      if (scopeId === INBOX_SCOPE_ID) {
        for (const item of orderArray) {
          state.taskOrder.inbox[item.id] = item.order_key;
        }
      }
    })
    .addCase(rebalanceOrderKeysAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to rebalance order keys";
    })
    .addCase(rebalanceOrderKeysAction.fulfilled, (state, action) => {
      state.error = null;
    });
};

export const addTaskCompletionExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(completeTaskAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to complete task";
    })
    .addCase(completeTaskAction.fulfilled, (state, action) => {
      const task = action.payload.task;

      state.status = "succeeded";
      state.error = null;
      state.tasks.byId[task.id] = task;

      if (!state.tasks.ids.includes(task.id)) {
        state.tasks.ids.push(task.id);
      }
    })
    .addCase(restoreCompletedTaskAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to restore task";
    })
    .addCase(restoreCompletedTaskAction.fulfilled, (state, action) => {
      const task = action.payload.task;

      state.status = "succeeded";
      state.error = null;
      state.tasks.byId[task.id] = task;

      if (!state.tasks.ids.includes(task.id)) {
        state.tasks.ids.push(task.id);
      }
    });
};
