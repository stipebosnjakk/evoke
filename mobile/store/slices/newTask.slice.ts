import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "@/store/initialStates/newTask.initialState";
import {
  setDeadlineReducer,
  setDescriptionReducer,
  setStartDateReducer,
  setTimeReducer,
  setStatusReducer,
  setRepeatReducer,
  setTitleReducer,
  validateTextInputsReducer,
  sendErrorMessageReducer,
  clearTaskStateReducer,
  clearCreateTaskErrorReducer,
} from "@/store/reducers/createTask.reducer";

const newTaskSlice = createSlice({
  name: "newTask",
  initialState,
  reducers: {
    setTitle: setTitleReducer,
    setDescription: setDescriptionReducer,
    setStatus: setStatusReducer,
    setRepeat: setRepeatReducer,
    setStartDate: setStartDateReducer,
    setTime: setTimeReducer,
    setDeadline: setDeadlineReducer,
    validateTextInputs: validateTextInputsReducer,
    sendErrorMessage: sendErrorMessageReducer,
    clearTaskState: clearTaskStateReducer,
    clearCreateTaskError: clearCreateTaskErrorReducer,
  },
});

export const {
  setTitle,
  setDescription,
  setStatus,
  setRepeat,
  setStartDate,
  setTime,
  setDeadline,
  validateTextInputs,
  sendErrorMessage,
  clearTaskState,
  clearCreateTaskError,
} = newTaskSlice.actions;

export default newTaskSlice.reducer;
