import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { ProjectsState, TasksState } from "@/types/initialState.types";
import {
  addTasksToProjectAction,
  completeTaskAction,
  restoreCompletedTaskAction,
  updateOrderKeysAction,
} from "@/store/thunks/update.thunks";
import { INBOX_SCOPE_ID } from "@/constants/scopeIds";

export const addInboxReorderExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(updateOrderKeysAction.pending, (state, action) => {
      const { orderArray, scopeId } = action.meta.arg;
      if (scopeId !== INBOX_SCOPE_ID) return;
      state.error = null;
      for (const item of orderArray) {
        state.taskOrder.inbox[item.id] = item.order_key;
      }
    })
    .addCase(updateOrderKeysAction.rejected, (state, action) => {
      if (action.meta.arg.scopeId !== INBOX_SCOPE_ID) return;
      state.error = action.payload?.message || "Failed to update order keys";
    })
    .addCase(updateOrderKeysAction.fulfilled, (state, action) => {
      if (action.payload.scopeId !== INBOX_SCOPE_ID) return;
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

export const addProjectTaskReorderExtraReducers = (
  builder: ActionReducerMapBuilder<ProjectsState>,
) => {
  builder
    .addCase(updateOrderKeysAction.pending, (state, action) => {
      const { orderArray, scopeId } = action.meta.arg;
      const project = state.projects.byId[scopeId];

      if (!project) return;

      state.error = null;

      const orderByTaskId = new Map(
        orderArray.map((item) => [item.id, item.order_key]),
      );

      for (const task of project.tasks) {
        const orderKey = orderByTaskId.get(task.id);
        if (orderKey !== undefined) {
          task.order_key = orderKey;
        }
      }
    })
    .addCase(updateOrderKeysAction.rejected, (state, action) => {
      const project = state.projects.byId[action.meta.arg.scopeId];

      if (!project) return;

      state.error = action.payload?.message || "Failed to update order keys";
    })
    .addCase(updateOrderKeysAction.fulfilled, (state, action) => {
      const project = state.projects.byId[action.payload.scopeId];

      if (!project) return;

      state.error = null;
    });
};

export const addTasksToProjectTaskExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(addTasksToProjectAction.pending, (state) => {
      state.error = null;
    })
    .addCase(addTasksToProjectAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to add tasks to project";
    })
    .addCase(addTasksToProjectAction.fulfilled, (state, action) => {
      const { projectTasks, project } = action.payload;

      state.status = "succeeded";
      state.error = null;

      for (const projectTask of projectTasks) {
        const task = state.tasks.byId[projectTask.id];

        if (!task) continue;

        task.project_id = project.id;
        task.project = project;
      }
    });
};

export const addTasksToProjectExtraReducers = (
  builder: ActionReducerMapBuilder<ProjectsState>,
) => {
  builder
    .addCase(addTasksToProjectAction.pending, (state) => {
      state.error = null;
    })
    .addCase(addTasksToProjectAction.rejected, (state, action) => {
      state.error = action.payload?.message || "Failed to add tasks to project";
    })
    .addCase(addTasksToProjectAction.fulfilled, (state, action) => {
      const { projectTasks, project } = action.payload;

      const stateProject = state.projects.byId[project.id];

      if (!stateProject) return;

      state.error = null;

      const addedTaskIds = new Set(projectTasks.map((task) => task.id));

      stateProject.tasks = [
        ...projectTasks,
        ...stateProject.tasks.filter((task) => !addedTaskIds.has(task.id)),
      ];
    });
};
