import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "@/store/tasks/initialStates/tasks.initialState";
import { changeContainerIdReducer } from "@/store/tasks/reducers/changeContainerIdReducer";
import { addInboxExtraReducers } from "@/store/tasks/extraReducers/inbox.extraReducer";
import { addReorderExtraReducers } from "@/store/tasks/extraReducers/reorder.extraReducer";
import { addCreationExtraReducers } from "@/store/tasks/extraReducers/create.extraReducers";
import { clearTaskScreenErrorReducer } from "@/store/tasks/reducers/clearTaskScreenErrorReducer";

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    changeContainerId: changeContainerIdReducer,
    clearTaskScreenError: clearTaskScreenErrorReducer,
  },
  extraReducers: (builder) => {
    addInboxExtraReducers(builder);
    addReorderExtraReducers(builder);
    addCreationExtraReducers(builder);
  },
});

export const { changeContainerId, clearTaskScreenError } = tasksSlice.actions;
export default tasksSlice.reducer;
