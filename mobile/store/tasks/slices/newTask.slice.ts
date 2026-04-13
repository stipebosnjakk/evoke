import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "@/store/tasks/initialStates/newTask.initialState";
import {
  setDeadlineReducer,
  setDescriptionReducer,
  setStartDateReducer,
  setTimeReducer,
  setStatusReducer,
  setTitleReducer,
  validateTextInputsReducer,
  sendErrorMessageReducer,
  clearStateReducer,
} from "@/store/tasks/reducers/createTaskReducer";

const newTaskSlice = createSlice({
  name: "newTask",
  initialState,
  reducers: {
    setTitle: setTitleReducer,
    setDescription: setDescriptionReducer,
    setStatus: setStatusReducer,
    setStartDate: setStartDateReducer,
    setTime: setTimeReducer,
    setDeadline: setDeadlineReducer,
    validateTextInputs: validateTextInputsReducer,
    sendErrorMessage: sendErrorMessageReducer,
    clearState: clearStateReducer,
  },
});

export const {
  setTitle,
  setDescription,
  setStatus,
  setStartDate,
  setTime,
  setDeadline,
  validateTextInputs,
  sendErrorMessage,
  clearState,
} = newTaskSlice.actions;
export default newTaskSlice.reducer;
