import { createAsyncThunk } from "@reduxjs/toolkit";

import { getErrorMessage } from "@/utils/error";
import { IsoDate, RejectWithValue, TaskStateData } from "@/types/task.types";
import {
  completeTaskRepo,
  restoreCompletedTaskRepo,
  completeRepeatTaskRepo,
  restoreRepeatTaskRepo,
} from "@/db/repositories/task/task.completion.repo";

type CompleteTaskType = {
  task: TaskStateData;
};

type CompleteTaskReturnType = {
  taskId: string;
};

export const completeTaskAction = createAsyncThunk<
  CompleteTaskType,
  CompleteTaskReturnType,
  { rejectValue: RejectWithValue }
>("tasks/completeTask", async ({ taskId }, { rejectWithValue }) => {
  try {
    const task = await completeTaskRepo(taskId);
    return { task };
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to complete task"),
    });
  }
});

type RestoreCompletedTaskActionType = {
  task: TaskStateData;
};

type RestoreCompletedTaskActionReturnType = {
  taskId: string;
};

export const restoreCompletedTaskAction = createAsyncThunk<
  RestoreCompletedTaskActionType,
  RestoreCompletedTaskActionReturnType,
  { rejectValue: RejectWithValue }
>("tasks/restoreCompletedTask", async ({ taskId }, { rejectWithValue }) => {
  try {
    const task = await restoreCompletedTaskRepo(taskId);
    return { task };
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to restore task"),
    });
  }
});

type RepeatTaskCompletionReturn = {
  taskId: string;
};

type RepeatTaskCompletion = {
  taskId: string;
  completionDate: IsoDate;
};

export const repeatTaskCompletionAction = createAsyncThunk<
  RepeatTaskCompletionReturn,
  RepeatTaskCompletion,
  { rejectValue: RejectWithValue }
>(
  "RepeatTaskCompletions/create",
  async ({ taskId, completionDate }, { rejectWithValue }) => {
    try {
      if (!taskId) {
        return rejectWithValue({
          message: "Task ID is required",
        });
      }

      await completeRepeatTaskRepo(taskId, completionDate);

      return {
        taskId,
      };
    } catch (error: unknown) {
      return rejectWithValue({
        message: getErrorMessage(error, "Failed to complete repeating task"),
      });
    }
  },
);

type RestoreCompletedRepeatTaskType = {
  taskId: string;
};

type RestoreCompletedRepeatTaskReturn = {
  taskId: string;
  completionDate: IsoDate;
};

export const restoreCompletedRepeatTaskAction = createAsyncThunk<
  RestoreCompletedRepeatTaskType,
  RestoreCompletedRepeatTaskReturn,
  {
    rejectValue: RejectWithValue;
  }
>(
  "tasks/restoreCompletedRepeatTask",
  async ({ taskId, completionDate }, { rejectWithValue }) => {
    try {
      await restoreRepeatTaskRepo(taskId, completionDate);

      return {
        taskId,
      };
    } catch (error) {
      return rejectWithValue({
        message: getErrorMessage(error, "Failed to restore repeating task"),
      });
    }
  },
);
