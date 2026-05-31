import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { ProjectsState, TasksState } from "@/types/initialState.types";
import {
  createProjectAction,
  createTaskAction,
} from "@/store/thunks/create.thunks";

export const addTaskCreateExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(createTaskAction.pending, (state, _) => {
      state.error = null;
    })
    .addCase(createTaskAction.rejected, (state, action) => {
      state.status = "failed";
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
        state.tasks.ids.push(task.id);
      }

      if (order_key !== null) {
        state.taskOrder.inbox[task.id] = order_key;
      }

      state.tasks.byId[task.id] = task;
    });
};

export const addProjectCreateExtraReducers = (
  builder: ActionReducerMapBuilder<ProjectsState>,
) => {
  builder
    .addCase(createProjectAction.pending, (state: ProjectsState, _) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(createProjectAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to create a project";
    })
    .addCase(createProjectAction.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;

      const { project, order_key } = action.payload;

      if (!project) {
        state.error = "Failed to create a project";
        return;
      }

      if (!state.projects.ids.includes(project.id)) {
        state.projects.ids.push(project.id);
      }

      if (order_key !== null) {
        state.projectOrder.main[project.id] = order_key;
      }

      state.projects.byId[project.id] = project;
    });
};
