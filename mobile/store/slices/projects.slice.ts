import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "@/store/initialStates/projects.initialState";
import { addProjectCreateExtraReducers } from "@/store/extraReducers/create.extraReducers";
import { clearProjectScreenErrorReducer } from "@/store/reducers/clearScreenError.reducer";
import { addProjectsExtraReducers } from "../extraReducers/fetch.extraReducer";

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearProjectScreenError: clearProjectScreenErrorReducer,
  },
  extraReducers: (builder) => {
    addProjectsExtraReducers(builder);
    addProjectCreateExtraReducers(builder);
  },
});

export const { clearProjectScreenError } = projectsSlice.actions;
export default projectsSlice.reducer;
