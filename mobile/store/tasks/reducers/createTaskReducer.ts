import { PayloadAction } from "@reduxjs/toolkit";

import { NewTaskInitialState } from "@/types/initialState";
import { TaskStatusOption } from "@/types/task.types";
import {
  validateTaskDeadline,
  validateTaskDescription,
  validateTaskDueTime,
  validateTaskStartDate,
  validateTaskStartTime,
  validateTaskStatus,
  validateTaskTitle,
} from "@/utils/validateTask";
import { getTodayIsoDate } from "@/utils/date";

export const setTitleReducer = (
  state: NewTaskInitialState,
  action: PayloadAction<{ title: string | null }>,
) => {
  state.inputs.title = action.payload.title;
};

export const setDescriptionReducer = (
  state: NewTaskInitialState,
  action: PayloadAction<{ description: string | null }>,
) => {
  state.inputs.description = action.payload.description;
};

export const setStatusReducer = (
  state: NewTaskInitialState,
  action: PayloadAction<{ status: TaskStatusOption | null }>,
) => {
  const res = validateTaskStatus(action.payload.status);

  if (!res.ok) {
    state.error = res.message;

    return;
  }

  state.task.status = res.data;
  state.error = null;
};

export const setStartDateReducer = (
  state: NewTaskInitialState,
  action: PayloadAction<{ start_date: string | null }>,
) => {
  const res = validateTaskStartDate(
    action.payload.start_date,
    state.task.deadline,
  );

  if (!res.ok) {
    state.error = res.message;
    return;
  }

  if (res.ok && res.data === null) {
    state.task.start_date = null;
    state.task.start_time_min = null;
    state.task.due_time_min = null;
    state.error = null;
    return;
  }

  state.task.start_date = res.data;
  state.error = null;
};

export const setDeadlineReducer = (
  state: NewTaskInitialState,
  action: PayloadAction<{ deadline: string | null }>,
) => {
  const res = validateTaskDeadline(
    action.payload.deadline,
    state.task.start_date,
  );

  if (!res.ok) {
    state.error = res.message;
    return;
  }

  state.task.deadline = res.data;
  state.error = null;
};

export const setStartTimeReducer = (
  state: NewTaskInitialState,
  action: PayloadAction<{ start_time_min: number | null }>,
) => {
  const res = validateTaskStartTime(
    action.payload.start_time_min,
    state.task.due_time_min,
  );

  if (!res.ok) {
    state.error = res.message;
    return;
  }

  if (res.data !== null && !state.task.start_date) {
    const today = getTodayIsoDate();
    state.task.start_date = today;
  }

  state.task.start_time_min = res.data;
  state.error = null;
};

export const setDueTimeReducer = (
  state: NewTaskInitialState,
  action: PayloadAction<{ due_time_min: number | null }>,
) => {
  const res = validateTaskDueTime(
    action.payload.due_time_min,
    state.task.start_time_min,
  );

  if (!res.ok) {
    state.error = res.message;
    return;
  }

  state.task.due_time_min = res.data;
  state.error = null;
};

export const validateTextInputsReducer = (state: NewTaskInitialState) => {
  const titleRes = validateTaskTitle(state.inputs.title);

  if (!titleRes.ok) {
    state.error = titleRes.message;
    return;
  }

  const descriptionRes = validateTaskDescription(state.inputs.description);

  if (!descriptionRes.ok) {
    state.error = descriptionRes.message;
    return;
  }

  console.log(titleRes.ok)
  console.log(descriptionRes.ok)

  state.task.title = titleRes.data;
  state.task.description = descriptionRes.data;
  state.error = null;
};
