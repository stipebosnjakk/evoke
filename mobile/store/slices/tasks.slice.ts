import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "@/store/initialStates/tasks.initialState";
import {
  addTaskComplationExtraReducers,
  addTaskCreateExtraReducers,
} from "@/store/extraReducers/create.extraReducers";
import { clearTaskScreenErrorReducer } from "@/store/reducers/clearScreenError.reducer";
import { addActiveTasksExtraReducers } from "@/store/extraReducers/fetch.extraReducer";
import {
  addCompleteProjectTasksExtraReducers,
  addDeleteProjectTasksExtraReducers,
  addInboxReorderExtraReducers,
  addTaskCompletionExtraReducers,
  addTasksToProjectTaskExtraReducers,
} from "@/store/extraReducers/mutation.extraReducer";

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTaskScreenError: clearTaskScreenErrorReducer,
  },
  extraReducers: (builder) => {
    addActiveTasksExtraReducers(builder);
    addInboxReorderExtraReducers(builder);
    addTaskCreateExtraReducers(builder);
    addTaskCompletionExtraReducers(builder);
    addTasksToProjectTaskExtraReducers(builder);
    addCompleteProjectTasksExtraReducers(builder);
    addTaskComplationExtraReducers(builder);
    addDeleteProjectTasksExtraReducers(builder);
  },
});

export const { clearTaskScreenError } = tasksSlice.actions;
export default tasksSlice.reducer;
