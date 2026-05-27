import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "@/store/initialStates/tasks.initialState";
import { addTaskCreateExtraReducers } from "@/store/extraReducers/create.extraReducers";
import { clearTaskScreenErrorReducer } from "@/store/reducers/clearScreenError.reducer";
import { addActiveTasksExtraReducers } from "@/store/extraReducers/fetch.extraReducer";
import {
  addReorderExtraReducers,
  addTaskCompletionExtraReducers,
} from "@/store/extraReducers/update.extraReducer";

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTaskScreenError: clearTaskScreenErrorReducer,
  },
  extraReducers: (builder) => {
    addActiveTasksExtraReducers(builder);
    addReorderExtraReducers(builder);
    addTaskCreateExtraReducers(builder);
    addTaskCompletionExtraReducers(builder);
  },
});

export const { clearTaskScreenError } = tasksSlice.actions;
export default tasksSlice.reducer;
