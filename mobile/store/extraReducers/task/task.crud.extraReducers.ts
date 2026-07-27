import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { TasksState } from "@/types/initialState.types";
import {
  createTaskAction,
  deleteTaskAction,
  updateTaskAction,
} from "@/store/thunks/task/task.crud.thunks";

export const addCreateTaskExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(createTaskAction.pending, (state, _) => {
      state.error = null;
    })
    .addCase(createTaskAction.rejected, (state, action) => {
      state.error = action.payload?.message ?? "Failed to create task";
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
        state.tasks.ids.unshift(task.id);
      }

      if (order_key !== null) {
        state.taskOrder.inbox[task.id] = order_key;
      }

      state.tasks.byId[task.id] = task;
    });
};

export const addUpdateTaskExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(updateTaskAction.pending, (state) => {
      state.error = null;
    })
    .addCase(updateTaskAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to update task";
    })
    .addCase(updateTaskAction.fulfilled, (state, action) => {
      const { task, inboxOrderKey } = action.payload;

      state.status = "succeeded";
      state.error = null;

      state.tasks.byId[task.id] = task;

      if (!state.tasks.ids.includes(task.id)) {
        state.tasks.ids.push(task.id);
      }

      if (inboxOrderKey === null) {
        delete state.taskOrder.inbox[task.id];
      } else {
        state.taskOrder.inbox[task.id] = inboxOrderKey;
      }
    });
};

export const addDeleteTaskExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(deleteTaskAction.pending, (state) => {
      state.error = null;
    })
    .addCase(deleteTaskAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to delete task";
    })
    .addCase(deleteTaskAction.fulfilled, (state, action) => {
      const { task } = action.payload;

      state.status = "succeeded";
      state.error = null;

      delete state.tasks.byId[task.id];
      delete state.taskOrder.inbox[task.id];

      state.tasks.ids = state.tasks.ids.filter((taskId) => taskId !== task.id);
    });
};
