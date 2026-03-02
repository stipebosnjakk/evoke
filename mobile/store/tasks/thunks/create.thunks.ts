import { createAsyncThunk } from "@reduxjs/toolkit";

import { createTaskRepo } from "@/db/repositories/create.repo";
import { RejectWithValue, TaskWithOrderKey } from "@/types/task.types";
import { handleErrorMessage } from "@/utils/handleErrorMessage";

export const createTaskAction = createAsyncThunk<
  { task: TaskWithOrderKey },
  { title: string },
  { rejectValue: RejectWithValue }
>("tasks/create", async ({ title }, { rejectWithValue }) => {
  try {
    const task = await createTaskRepo(title);
    return { task };
  } catch (error: unknown) {
    return rejectWithValue({
      message: handleErrorMessage(error, "Failed to create task"),
    });
  }
});
