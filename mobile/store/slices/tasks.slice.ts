import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "@/store/initialStates/tasks.initialState";
import { clearTaskScreenErrorReducer } from "@/store/reducers/clearScreenError.reducer";
import {
  addCompleteProjectTasksExtraReducers,
  addCompleteRepeatTaskExtraReducers,
  addCompleteTaskExtraReducers,
  addCreateTaskExtraReducers,
  addDeleteProjectTasksExtraReducers,
  addDeleteTaskExtraReducers,
  addFetchActiveTasksExtraReducers,
  addRemoveTaskFromProjectExtraReducers,
  addRestoreRepeatTaskExtraReducers,
  addRestoreTaskExtraReducers,
  addTasksToProjectExtraReducers,
  addUpdateInboxOrderExtraReducers,
  addUpdateTaskDeadlineExtraReducers,
  addUpdateTaskExtraReducers,
  addUpdateTaskInputsExtraReducers,
  addUpdateTaskProjectExtraReducers,
  addUpdateTaskRepeatDaysExtraReducers,
  addUpdateTaskStartDateExtraReducers,
  addUpdateTaskStatusExtraReducers,
} from "@/store/extraReducers/task";

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearTaskScreenError: clearTaskScreenErrorReducer,
  },
  extraReducers: (builder) => {
    addCreateTaskExtraReducers(builder);
    addUpdateTaskExtraReducers(builder);
    addDeleteTaskExtraReducers(builder);
    addFetchActiveTasksExtraReducers(builder);
    addCompleteTaskExtraReducers(builder);
    addRestoreTaskExtraReducers(builder);
    addCompleteRepeatTaskExtraReducers(builder);
    addRestoreRepeatTaskExtraReducers(builder);
    addTasksToProjectExtraReducers(builder);
    addCompleteProjectTasksExtraReducers(builder);
    addDeleteProjectTasksExtraReducers(builder);
    addRemoveTaskFromProjectExtraReducers(builder);
    addUpdateInboxOrderExtraReducers(builder);
    addUpdateTaskInputsExtraReducers(builder);
    addUpdateTaskStatusExtraReducers(builder);
    addUpdateTaskProjectExtraReducers(builder);
    addUpdateTaskStartDateExtraReducers(builder);
    addUpdateTaskDeadlineExtraReducers(builder);
    addUpdateTaskRepeatDaysExtraReducers(builder);
  },
});

export const { clearTaskScreenError } = tasksSlice.actions;
export default tasksSlice.reducer;
