import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "@/store/tasks/initialStates/tasks.initialState";
import { addReorderExtraReducers } from "@/store/tasks/extraReducers/update.extraReducer";
import { addCreationExtraReducers } from "@/store/tasks/extraReducers/create.extraReducers";
import { clearTaskScreenErrorReducer } from "@/store/tasks/reducers/clearTaskScreenError.reducer";
import { addActiveTasksExtraReducers } from "../extraReducers/fetch.extraReducer";

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTaskScreenError: clearTaskScreenErrorReducer,
  },
  extraReducers: (builder) => {
    addActiveTasksExtraReducers(builder);
    addReorderExtraReducers(builder);
    addCreationExtraReducers(builder);
  },
});

export const { clearTaskScreenError } = tasksSlice.actions;
export default tasksSlice.reducer;
