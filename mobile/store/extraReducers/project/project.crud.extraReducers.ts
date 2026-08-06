import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { ProjectsState } from "@/types/initialState.types";
import {
  createProjectAction,
  deleteProjectAction,
  updateProjectAction,
} from "@/store/thunks/project/project.crud.thunks";

export const addCreateProjectExtraReducers = (
  builder: ActionReducerMapBuilder<ProjectsState>,
) => {
  builder
    .addCase(createProjectAction.pending, (state: ProjectsState, _) => {
      state.error = null;
    })
    .addCase(createProjectAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message ?? "Failed to create a project";
    })
    .addCase(createProjectAction.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;

      const { project, order_key } = action.payload;

      if (!state.projects.ids.includes(project.id)) {
        state.projects.ids.unshift(project.id);
      }

      if (order_key !== null) {
        state.projectOrder.main[project.id] = order_key;
      }

      state.projects.byId[project.id] = project;
    });
};

export const addUpdateProjectExtraReducers = (
  builder: ActionReducerMapBuilder<ProjectsState>,
) => {
  builder
    .addCase(updateProjectAction.pending, (state) => {
      state.error = null;
    })
    .addCase(updateProjectAction.rejected, (state, action) => {
      state.error = action.payload?.message || "Failed to update project";
    })
    .addCase(updateProjectAction.fulfilled, (state, action) => {
      const { project } = action.payload;
      const existingProject = state.projects.byId[project.id];

      if (!existingProject) {
        state.error = "Failed to get project data";
        return;
      }

      state.error = null;

      state.projects.byId[project.id] = {
        ...existingProject,
        ...project,
      };
    });
};

export const addDeleteProjectExtraReducers = (
  builder: ActionReducerMapBuilder<ProjectsState>,
) => {
  builder
    .addCase(deleteProjectAction.pending, (state) => {
      state.error = null;
    })
    .addCase(deleteProjectAction.rejected, (state, action) => {
      state.error = action.payload?.message || "Failed to delete project";
    })
    .addCase(deleteProjectAction.fulfilled, (state, action) => {
      const { project } = action.payload;

      state.error = null;

      delete state.projects.byId[project.id];

      state.projects.ids = state.projects.ids.filter(
        (projectId) => projectId !== project.id,
      );
    });
};
