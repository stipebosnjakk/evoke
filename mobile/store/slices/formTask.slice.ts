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
  setDeadline,
  setProjectId,
  validateTextInputs,
  sendErrorMessage,
  clearTaskState,
  clearCreateTaskError,
  editTask,
} = formTaskSlice.actions;

export default formTaskSlice.reducer;
