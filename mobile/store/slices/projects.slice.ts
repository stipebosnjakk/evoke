import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "@/store/initialStates/projects.initialState";
import { clearProjectScreenErrorReducer } from "@/store/reducers/clearScreenError.reducer";
import {
  addCompleteProjectExtraReducers,
  addCreateProjectExtraReducers,
  addCreateProjectTaskExtraReducers,
  addDeleteProjectExtraReducers,
  addDeleteProjectTaskExtraReducers,
  addFetchProjectsExtraReducers,
  addRemoveTaskFromProjectExtraReducers,
  addTasksToProjectExtraReducers,
  addUpdateProjectExtraReducers,
  addUpdateProjectTaskExtraReducers,
  addUpdateProjectTaskOrderExtraReducers,
} from "@/store/extraReducers/project";

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearProjectScreenError: clearProjectScreenErrorReducer,
  },
  extraReducers: (builder) => {
    addCreateProjectExtraReducers(builder);
    addUpdateProjectExtraReducers(builder);
    addDeleteProjectExtraReducers(builder);
    addFetchProjectsExtraReducers(builder);
    addCompleteProjectExtraReducers(builder);
    addTasksToProjectExtraReducers(builder);
    addRemoveTaskFromProjectExtraReducers(builder);
    addCreateProjectTaskExtraReducers(builder);
    addDeleteProjectTaskExtraReducers(builder);
    addUpdateProjectTaskExtraReducers(builder);
    addUpdateProjectTaskOrderExtraReducers(builder);
  },
});

export const { clearProjectScreenError } = projectsSlice.actions;
export default projectsSlice.reducer;
