import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { TasksState } from "@/types/initialState.types";
import {
  completeTaskAction,
  repeatTaskCompletionAction,
  restoreCompletedRepeatTaskAction,
  restoreCompletedTaskAction,
} from "@/store/thunks/task/task.completion.thunks";

export const addCompleteTaskExtraReducers = (
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
    });
};

export const addRestoreTaskExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
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

export const addCompleteRepeatTaskExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(repeatTaskCompletionAction.pending, (state) => {
      state.error = null;
    })
    .addCase(repeatTaskCompletionAction.rejected, (state, action) => {
      state.error =
        action.payload?.message ?? "Failed to complete repeating task";
    })
    .addCase(repeatTaskCompletionAction.fulfilled, (state, action) => {
      state.error = null;

      const { taskId } = action.payload;

      const task = state.tasks.byId[taskId];

      if (!task) return;

      task.repeat_today_status = "completed_today";
    });
};

export const addRestoreRepeatTaskExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(restoreCompletedRepeatTaskAction.rejected, (state, action) => {
      state.status = "failed";
      state.error =
        action.payload?.message || "Failed to restore repeating task";
    })
    .addCase(restoreCompletedRepeatTaskAction.fulfilled, (state, action) => {
      const { taskId } = action.payload;
      const task = state.tasks.byId[taskId];

      state.status = "succeeded";
      state.error = null;

      if (!task) return;

      task.repeat_today_status = "not_completed_today";
    });
};
