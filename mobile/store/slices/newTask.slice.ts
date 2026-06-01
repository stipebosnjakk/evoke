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
  setProjectIdReducer,
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
    setProjectId: setProjectIdReducer,
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
  setProjectId,
  validateTextInputs,
  sendErrorMessage,
  clearTaskState,
  clearCreateTaskError,
} = newTaskSlice.actions;

export default newTaskSlice.reducer;
