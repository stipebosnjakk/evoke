import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { TasksState } from "@/types/initialState.types";
import {
  addTasksToProjectAction,
  removeTaskFromProjectAction,
} from "@/store/thunks/project/project.tasks.thunks";
import { completeProjectAction } from "@/store/thunks/project/project.completion.thunks";
import { deleteProjectAction } from "@/store/thunks/project/project.crud.thunks";

export const addTasksToProjectExtraReducers = (
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

export const addCompleteProjectTasksExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(completeProjectAction.pending, (state) => {
      state.error = null;
    })
    .addCase(completeProjectAction.rejected, (state, action) => {
      state.error =
        action.payload?.message || "Failed to complete project tasks";
    })
    .addCase(completeProjectAction.fulfilled, (state, action) => {
      const { tasks } = action.payload;
      state.error = null;

      for (const task of tasks) {
        const oldTask = state.tasks.byId[task.id];

        state.tasks.byId[task.id] = {
          ...oldTask,
          ...task,
        };

        if (!state.tasks.ids.includes(task.id)) {
          state.tasks.ids.push(task.id);
        }
      }
    });
};

export const addDeleteProjectTasksExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(deleteProjectAction.pending, (state) => {
      state.error = null;
    })
    .addCase(deleteProjectAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to delete project tasks";
    })
    .addCase(deleteProjectAction.fulfilled, (state, action) => {
      const { tasks: deletedTasks } = action.payload;
      const deletedTaskIds = new Set(deletedTasks.map((task) => task.id));

      state.status = "succeeded";
      state.error = null;

      for (const taskId of deletedTaskIds) {
        delete state.tasks.byId[taskId];
        delete state.taskOrder.inbox[taskId];
      }

      state.tasks.ids = state.tasks.ids.filter(
        (taskId) => !deletedTaskIds.has(taskId),
      );
    });
};

export const addRemoveTaskFromProjectExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(removeTaskFromProjectAction.pending, (state) => {
      state.error = null;
    })
    .addCase(removeTaskFromProjectAction.rejected, (state, action) => {
      state.status = "failed";
      state.error =
        action.payload?.message || "Failed to remove task from project";
    })
    .addCase(removeTaskFromProjectAction.fulfilled, (state, action) => {
      const { task } = action.payload;

      state.status = "succeeded";
      state.error = null;

      state.tasks.byId[task.id] = task;

      if (!state.tasks.ids.includes(task.id)) {
        state.tasks.ids.push(task.id);
      }
    });
};
