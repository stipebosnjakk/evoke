import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "@/store/store";
import { getErrorMessage } from "@/utils/error";
import { CreatedTask, RejectWithValue, TaskStatus } from "@/types/task.types";
import {
  createTaskRepo,
  UpdateTaskReturnType,
  updateTaskRepo,
  DeleteTaskReturnType,
  deleteTaskRepo,
  UpdateTaskInputsReturnType,
  updateTaskInputsRepo,
  UpdateTaskStatusReturnType,
  updateTaskStatusRepo,
  UpdateTaskProjectReturnType,
  updateTaskProjectRepo,
  UpdateTaskStartDateArgsType,
  TaskStartDateReturnType,
  updateTaskStartDateRepo,
  UpdateTaskDeadlineReturnType,
  UpdateTaskDeadlineArgsType,
  updateTaskDeadlineRepo,
  UpdateTaskRepeatDaysReturnType,
  UpdateTaskRepeatDays,
  updateTaskRepeatDaysRepo,
  updateTaskTimeRepo,
  UpdateTaskTimeReturnType,
  UpdateTaskTimeArgs,
  UpdateTaskDurationReturnType,
  UpdateTaskDurationArgs,
  updateTaskDurationRepo,
} from "@/db/repositories/task/task.crud.repo";

export const createTaskAction = createAsyncThunk<
  CreatedTask,
  void,
  { rejectValue: RejectWithValue }
>("tasks/create", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState;
    const { formTask } = state;

    if (formTask.error) {
      return rejectWithValue({
        message: formTask.error,
      });
    }

    const res = await createTaskRepo(formTask.task);

    if (!res.task) {
      return rejectWithValue({
        message: "Task was not created properly",
      });
    }

    return res;
  } catch (error: unknown) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to create task"),
    });
  }
});

export const updateTaskAction = createAsyncThunk<
  UpdateTaskReturnType,
  { taskId: string },
  {
    state: RootState;
    rejectValue: RejectWithValue;
  }
>("tasks/updateTask", async ({ taskId }, { getState, rejectWithValue }) => {
  try {
    const state = getState();
    const { formTask } = state;

    if (formTask.error) {
      return rejectWithValue({
        message: formTask.error,
      });
    }

    const res = await updateTaskRepo(taskId, formTask.task);

    if (!res.task) {
      return rejectWithValue({
        message: "Task was not updated properly",
      });
    }

    return res;
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to update task"),
    });
  }
});

export const deleteTaskAction = createAsyncThunk<
  DeleteTaskReturnType,
  { taskId: string },
  { rejectValue: RejectWithValue }
>("tasks/deleteTask", async ({ taskId }, { rejectWithValue }) => {
  try {
    const res = await deleteTaskRepo(taskId);
    return res;
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to delete task"),
    });
  }
});

export type UpdateTaskInputsAction = {
  taskId: string;
  title: string | null;
  description: string | null;
};

export const updateTaskInputsAction = createAsyncThunk<
  UpdateTaskInputsReturnType,
  UpdateTaskInputsAction,
  { rejectValue: RejectWithValue }
>("tasks/updateInputs", async (taskInfo, { rejectWithValue }) => {
  try {
    const res = await updateTaskInputsRepo(taskInfo);
    return res;
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to update task inputs"),
    });
  }
});

export type UpdateTaskStatusAction = {
  taskId: string;
  status: TaskStatus | null;
};

export const updateTaskStatusAction = createAsyncThunk<
  UpdateTaskStatusReturnType,
  UpdateTaskStatusAction,
  { rejectValue: RejectWithValue }
>("tasks/updateStatus", async (taskInfo, { rejectWithValue }) => {
  try {
    const res = await updateTaskStatusRepo(taskInfo);
    return res;
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to update task status"),
    });
  }
});

export type UpdateTaskProjectAction = {
  taskId: string;
  projectId: string | null;
};

export const updateTaskProjectAction = createAsyncThunk<
  UpdateTaskProjectReturnType,
  UpdateTaskProjectAction,
  { rejectValue: RejectWithValue }
>("tasks/updateProject", async (taskInfo, { rejectWithValue }) => {
  try {
    const res = await updateTaskProjectRepo(taskInfo);
    return res;
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to update task project"),
    });
  }
});

export const updateTaskStartDateAction = createAsyncThunk<
  TaskStartDateReturnType,
  UpdateTaskStartDateArgsType,
  { rejectValue: RejectWithValue }
>("tasks/updateStartDate", async (data, { rejectWithValue }) => {
  try {
    const res = await updateTaskStartDateRepo(data);
    return res;
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to update task start date"),
    });
  }
});

export const updateTaskDeadlineAction = createAsyncThunk<
  UpdateTaskDeadlineReturnType,
  UpdateTaskDeadlineArgsType,
  { rejectValue: RejectWithValue }
>("tasks/updateDeadline", async (data, { rejectWithValue }) => {
  try {
    const res = await updateTaskDeadlineRepo(data);
    return res;
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to update task deadline"),
    });
  }
});

export const updateTaskRepeatDaysAction = createAsyncThunk<
  UpdateTaskRepeatDaysReturnType,
  UpdateTaskRepeatDays,
  { rejectValue: RejectWithValue }
>("tasks/updateRepeatDays", async (data, { rejectWithValue }) => {
  try {
    const res = await updateTaskRepeatDaysRepo(data);
    return res;
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to update task repeat days"),
    });
  }
});

export const updateTaskTimeAction = createAsyncThunk<
  UpdateTaskTimeReturnType,
  UpdateTaskTimeArgs,
  { rejectValue: RejectWithValue }
>("tasks/updateTime", async (data, { rejectWithValue }) => {
  try {
    const res = await updateTaskTimeRepo(data);
    return res;
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to update task time"),
    });
  }
});

export const updateTaskDurationAction = createAsyncThunk<
  UpdateTaskDurationReturnType,
  UpdateTaskDurationArgs,
  { rejectValue: RejectWithValue }
>("tasks/updateDuration", async (data, { rejectWithValue }) => {
  try {
    const res = await updateTaskDurationRepo(data);
    return res;
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to update task duration"),
    });
  }
});
