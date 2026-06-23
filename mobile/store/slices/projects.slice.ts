import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "@/store/initialStates/projects.initialState";
import { addProjectCreateExtraReducers } from "@/store/extraReducers/create.extraReducers";
import { clearProjectScreenErrorReducer } from "@/store/reducers/clearScreenError.reducer";
import { addProjectsExtraReducers } from "@/store/extraReducers/fetch.extraReducer";
import {
  addProjectTaskReorderExtraReducers,
  addTasksToProjectExtraReducers,
  addUpdateProjectExtraReducers,
} from "@/store/extraReducers/update.extraReducer";

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearProjectScreenError: clearProjectScreenErrorReducer,
  },
  extraReducers: (builder) => {
    addProjectsExtraReducers(builder);
    addProjectCreateExtraReducers(builder);
    addProjectTaskReorderExtraReducers(builder);
    addTasksToProjectExtraReducers(builder);
    addUpdateProjectExtraReducers(builder);
  },
});

export const { clearProjectScreenError } = projectsSlice.actions;
export default projectsSlice.reducer;
