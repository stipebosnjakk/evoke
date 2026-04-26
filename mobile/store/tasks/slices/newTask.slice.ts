import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "@/store/tasks/initialStates/newTask.initialState";
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
  clearStateReducer,
  clearCreateTaskErrorReducer,
} from "@/store/tasks/reducers/createTaskReducer";

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
    clearState: clearStateReducer,
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
  clearState,
  clearCreateTaskError,
} = newTaskSlice.actions;
export default newTaskSlice.reducer;
