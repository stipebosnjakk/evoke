import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "./initialState";
import { changeContainerIdReducer } from "@/store/tasks/reducers/changeContainerIdReducer";
import { addInboxExtraReducers } from "./extraReducers/inbox.extraReducer";
import { addReorderExtraReducers } from "./extraReducers/reorder.extraReducer";
import { addCreationExtraReducers } from "./extraReducers/create.extraReducers";

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    changeContainerId: changeContainerIdReducer,
  },
  extraReducers: (builder) => {
    addInboxExtraReducers(builder);
    addReorderExtraReducers(builder);
    addCreationExtraReducers(builder);
  },
});

export const { changeContainerId } = tasksSlice.actions;
export default tasksSlice.reducer;
