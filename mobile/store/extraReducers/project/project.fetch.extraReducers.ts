import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { ProjectsState } from "@/types/initialState.types";
import { fetchProjectsAction } from "@/store/thunks/project/project.fetch.thunks";

export const addFetchProjectsExtraReducers = (
  builder: ActionReducerMapBuilder<ProjectsState>,
) => {
  builder
    .addCase(fetchProjectsAction.pending, (state, _) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(fetchProjectsAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to load projects";
    })
    .addCase(fetchProjectsAction.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;
      state.projects = action.payload.projects;
    });
};
