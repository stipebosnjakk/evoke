import { PayloadAction } from "@reduxjs/toolkit";

import { NewTaskInitialState } from "@/types/initialState.types";
import { IsoDate, TaskStatusOption, Weekday } from "@/types/task.types";
import {
  validateTaskDeadline,
  validateTaskDescription,
  validateTaskRepeat,
  validateTaskStartDate,
  validateTaskStatus,
  validateTaskTime,
  validateTaskTitle,
} from "@/utils/validateTask";
import { initialState } from "@/store/tasks/initialStates/newTask.initialState";
import { toIsoDate } from "@/utils/date";

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

  if (!res.data) {
    state.task.status = null;
    state.error = null;
    return;
  }

  state.task.status = res.data.value;
  state.error = null;
};

export const setRepeatReducer = (
  state: NewTaskInitialState,
  action: PayloadAction<{ repeat: Weekday[] | null }>,
) => {
  const res = validateTaskRepeat(action.payload.repeat);

  if (!res.ok) {
    state.error = res.message;
    return;
  }

  if (!res.data) {
    state.task.repeat = null;
    state.error = null;
    return;
  }

  const sortedRepeat = [...res.data].sort((a, b) => a - b);

  state.task.repeat = sortedRepeat;
  state.error = null;
};

export const setStartDateReducer = (
  state: NewTaskInitialState,
  action: PayloadAction<{ start_date: IsoDate | null }>,
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
    state.task.duration_min = null;
    state.error = null;
    return;
  }

  state.task.start_date = res.data;
  state.error = null;
};

export const setDeadlineReducer = (
  state: NewTaskInitialState,
  action: PayloadAction<{ deadline: IsoDate | null }>,
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

export const setTimeReducer = (
  state: NewTaskInitialState,
  action: PayloadAction<{
    start_time_min: number | null;
    duration_min: number | null;
  }>,
) => {
  const res = validateTaskTime(
    action.payload.start_time_min,
    action.payload.duration_min,
  );

  if (!res.ok || !res.data) {
    state.error = res.message;
    return;
  }

  if (res.data?.start_time_min !== null && !state.task.start_date) {
    const today = toIsoDate(new Date());
    state.task.start_date = today;
  }

  state.task.start_time_min = res.data.start_time_min;
  state.task.duration_min = res.data.duration_min;
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

  state.task.title = titleRes.data;
  state.task.description = descriptionRes.data;
  state.error = null;
};

export const sendErrorMessageReducer = (
  state: NewTaskInitialState,
  action: PayloadAction<{ message: string | null }>,
) => {
  if (action.payload.message) {
    state.error = action.payload.message;
    return;
  }

  state.error = null;
};

export const clearStateReducer = () => initialState;
