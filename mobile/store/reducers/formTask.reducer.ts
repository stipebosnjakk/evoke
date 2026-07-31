import { PayloadAction } from "@reduxjs/toolkit";

import { FormTaskInitialState } from "@/types/initialState.types";
import {
  IsoDate,
  TaskStateData,
  TaskStatusOption,
  Weekday,
} from "@/types/task.types";
import {
  validateTaskDeadline,
  validateTaskDescription,
  validateTaskDuration,
  validateTaskRepeat,
  validateTaskStartDate,
  validateTaskStatus,
  validateTaskTime,
  validateTaskTitle,
} from "@/utils/validate";
import { initialState } from "@/store/initialStates/formTask.initialState";
import { toIsoDate } from "@/utils/date";

export const setTitleReducer = (
  state: FormTaskInitialState,
  action: PayloadAction<{ title: string | null }>,
) => {
  state.inputs.title = action.payload.title;
};

export const setDescriptionReducer = (
  state: FormTaskInitialState,
  action: PayloadAction<{ description: string | null }>,
) => {
  state.inputs.description = action.payload.description;
};

export const setStatusReducer = (
  state: FormTaskInitialState,
  action: PayloadAction<{ status: TaskStatusOption | null }>,
) => {
  const res = validateTaskStatus({ status: action.payload.status });

  if (!res.ok) {
    state.error = res.message;
    return;
  }

  if (!res.data) {
    state.task.repeat = null;
    state.task.status = null;
    state.error = null;
    return;
  }

  if (res.data.value !== "next") {
    state.task.repeat = null;
  }

  state.task.status = res.data.value;
  state.error = null;
};

export const setRepeatReducer = (
  state: FormTaskInitialState,
  action: PayloadAction<{ repeat: Weekday[] | null }>,
) => {
  const res = validateTaskRepeat({ repeatDays: action.payload.repeat });

  if (!res.ok) {
    state.error = res.message;
    return;
  }

  if (!res.data || res.data.length === 0) {
    state.task.repeat = null;
    state.error = null;
    return;
  }

  const sortedRepeat = [...res.data].sort((a, b) => a - b);

  state.task.status = "next";
  state.task.repeat = sortedRepeat;
  state.error = null;
};

export const setStartDateReducer = (
  state: FormTaskInitialState,
  action: PayloadAction<{ start_date: IsoDate | null }>,
) => {
  const res = validateTaskStartDate({
    start_date: action.payload.start_date,
    deadline: state.task.deadline ?? null,
    start_time_min: state.task.start_time_min ?? null,
  });

  if (!res.ok) {
    state.error = res.message;
    return;
  }

  if (res.ok && res.data === null) {
    state.task.start_date = null;
    state.task.start_time_min = null;
    state.error = null;
    return;
  }

  state.task.start_date = res.data;
  state.error = null;
};

export const setDeadlineReducer = (
  state: FormTaskInitialState,
  action: PayloadAction<{ deadline: IsoDate | null }>,
) => {
  const res = validateTaskDeadline({
    deadline: action.payload.deadline,
    startDate: state.task.start_date,
  });

  if (!res.ok) {
    state.error = res.message;
    return;
  }

  state.task.deadline = res.data;
  state.error = null;
};

export const setTimeReducer = (
  state: FormTaskInitialState,
  action: PayloadAction<{
    start_time_min: number | null;
  }>,
) => {
  const { start_time_min } = action.payload;

  const res = validateTaskTime({ start_time_min });

  if (!res.ok) {
    state.error = res.message;
    return;
  }

  state.task.start_time_min = res.data;
  state.error = null;
};

export const setDurationReducer = (
  state: FormTaskInitialState,
  action: PayloadAction<{
    duration_min: number | null;
  }>,
) => {
  const { duration_min } = action.payload;

  const res = validateTaskDuration({ duration_min });

  if (!res.ok) {
    state.error = res.message;
    return;
  }

  state.task.duration_min = res.data;
  state.error = null;
};

export const validateTextInputsReducer = (state: FormTaskInitialState) => {
  const titleRes = validateTaskTitle({ title: state.inputs.title });

  if (!titleRes.ok) {
    throw new Error(titleRes.message);
  }

  const descriptionRes = validateTaskDescription({
    description: state.inputs.description,
  });

  if (!descriptionRes.ok) {
    throw new Error(descriptionRes.message);
  }

  state.task.title = titleRes.data;
  state.task.description = descriptionRes.data;
};

export const sendErrorMessageReducer = (
  state: FormTaskInitialState,
  action: PayloadAction<{ message: string | null }>,
) => {
  if (action.payload.message) {
    state.error = action.payload.message;
    return;
  }

  state.error = null;
};

export const setProjectIdReducer = (
  state: FormTaskInitialState,
  action: PayloadAction<{ projectId: string | null | undefined }>,
) => {
  state.task.project_id = action.payload.projectId;
};

export const clearCreateTaskErrorReducer = (state: FormTaskInitialState) => {
  state.error = null;
};

export const editTaskReducer = (
  state: FormTaskInitialState,
  action: PayloadAction<{ task: TaskStateData }>,
) => {
  const task = action.payload.task;

  state.task = {
    title: task.title,
    description: task.description,
    status: task.status,
    project_id: task.project_id,
    start_date: task.start_date,
    start_time_min: task.start_time_min,
    duration_min: task.duration_min,
    deadline: task.deadline,
    repeat: task.repeat,
  };

  state.inputs = {
    title: task.title,
    description: task.description,
  };

  state.error = null;
};

export const clearTaskStateReducer = () => initialState;
