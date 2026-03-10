import { createAsyncThunk } from "@reduxjs/toolkit";

import { createTaskRepo } from "@/db/repositories/create.repo";
import { RejectWithValue, TaskWithOrderKey } from "@/types/task.types";
import { handleErrorMessage } from "@/utils/handleErrorMessage";
import { validateTextInputs } from "@/store/tasks/slices/newTask.slice";
import { RootState } from "@/store/store";

export const createTaskAction = createAsyncThunk<
  { task: TaskWithOrderKey },
  void,
  { rejectValue: RejectWithValue }
>("tasks/create", async (_, { dispatch, getState, rejectWithValue }) => {
  try {
    await dispatch(validateTextInputs());

    const state = getState() as RootState;
    const { newTask } = state;

    console.log(newTask);

    if (newTask.error) {
      return rejectWithValue({
        message: newTask.error,
      });
    }

    // TODO: I think we should change initial type to be TaskWithOrderKey instead if NewTaskState, just set everything to be null
    const task = await createTaskRepo(newTask.task);
    return { task };
  } catch (error: unknown) {
    return rejectWithValue({
      message: handleErrorMessage(error, "Failed to create task"),
    });
  }
});
