import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "@/store/store";
import { CreatedTask, RejectWithValue } from "@/types/task.types";
import { getErrorMessage } from "@/utils/error";
import {
  createTaskRepo,
  UpdateTaskReturnType,
  updateTaskRepo,
  DeleteTaskReturnType,
  deleteTaskRepo,
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
    if (!taskId.trim()) {
      return rejectWithValue({
        message: "Task ID is required",
      });
    }

    const state = getState();
    const { formTask } = state;

    if (formTask.error) {
      return rejectWithValue({
        message: formTask.error,
      });
    }

    const result = await updateTaskRepo(taskId, formTask.task);

    if (!result.task) {
      return rejectWithValue({
        message: "Task was not updated properly",
      });
    }

    return result;
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
    const data = await deleteTaskRepo(taskId);
    return data;
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to delete task"),
    });
  }
});
