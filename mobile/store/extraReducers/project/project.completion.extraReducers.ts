import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { ProjectsState } from "@/types/initialState.types";
import { completeProjectAction } from "@/store/thunks/project/project.completion.thunks";

export const addCompleteProjectExtraReducers = (
  builder: ActionReducerMapBuilder<ProjectsState>,
) => {
  builder
    .addCase(completeProjectAction.pending, (state) => {
      state.error = null;
    })
    .addCase(completeProjectAction.rejected, (state, action) => {
      state.error = action.payload?.message || "Failed to complete project";
    })
    .addCase(completeProjectAction.fulfilled, (state, action) => {
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
