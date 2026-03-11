import { createAsyncThunk } from "@reduxjs/toolkit";

import { createTaskRepo } from "@/db/repositories/create.repo";
import { RejectWithValue } from "@/types/task.types";
import { handleErrorMessage } from "@/utils/handleErrorMessage";
import {
  clearState,
  validateTextInputs,
} from "@/store/tasks/slices/newTask.slice";
import { RootState } from "@/store/store";
import { NewTask } from "@/db";

export const createTaskAction = createAsyncThunk<
  { task: NewTask },
  void,
  { rejectValue: RejectWithValue }
>("tasks/create", async (_, { dispatch, getState, rejectWithValue }) => {
  try {
    await dispatch(validateTextInputs());

    const state = getState() as RootState;
    const { newTask } = state;

    if (newTask.error) {
      return rejectWithValue({
        message: newTask.error,
      });
    }

    const task = await createTaskRepo(newTask.task);

    if (!task || !task.id) {
      return rejectWithValue({
        message: "Task was not created properly",
      });
    }

    dispatch(clearState());

    return { task };
  } catch (error: unknown) {
    return rejectWithValue({
      message: handleErrorMessage(error, "Failed to create task"),
    });
  }
});
