import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "@/store/tasks/initialStates/newTask.initialState";
import {
  setDeadlineReducer,
  setDescriptionReducer,
  setDueTimeReducer,
  setStartDateReducer,
  setStartTimeReducer,
  setStatusReducer,
  setTitleReducer,
  validateTextInputsReducer,
} from "@/store/tasks/reducers/createTaskReducer";

const newTaskSlice = createSlice({
  name: "newTask",
  initialState,
  reducers: {
    setTitle: setTitleReducer,
    setDescription: setDescriptionReducer,
    setStatus: setStatusReducer,
    setStartDate: setStartDateReducer,
    setStartTime: setStartTimeReducer,
    setDueTime: setDueTimeReducer,
    setDeadline: setDeadlineReducer,
    validateTextInputs: validateTextInputsReducer,
  },
});

export const {
  setTitle,
  setDescription,
  setStatus,
  setStartDate,
  setStartTime,
  setDueTime,
  setDeadline,
  validateTextInputs,
} = newTaskSlice.actions;
export default newTaskSlice.reducer;
