import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "@/store/initialStates/formTask.initialState";
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
  editTaskReducer,
  setDurationReducer,
} from "@/store/reducers/formTask.reducer";

const formTaskSlice = createSlice({
  name: "formTask",
  initialState,
  reducers: {
    setTitle: setTitleReducer,
    setDescription: setDescriptionReducer,
    setStatus: setStatusReducer,
    setRepeat: setRepeatReducer,
    setStartDate: setStartDateReducer,
    setTime: setTimeReducer,
    setDuration: setDurationReducer,
    setDeadline: setDeadlineReducer,
    setProjectId: setProjectIdReducer,
    validateTextInputs: validateTextInputsReducer,
    sendErrorMessage: sendErrorMessageReducer,
    clearTaskState: clearTaskStateReducer,
    clearCreateTaskError: clearCreateTaskErrorReducer,
    editTask: editTaskReducer,
  },
});

export const {
  setTitle,
  setDescription,
  setStatus,
  setRepeat,
  setStartDate,
  setTime,
  setDuration,
  setDeadline,
  setProjectId,
  validateTextInputs,
  sendErrorMessage,
  clearTaskState,
  clearCreateTaskError,
  editTask,
} = formTaskSlice.actions;

export default formTaskSlice.reducer;
