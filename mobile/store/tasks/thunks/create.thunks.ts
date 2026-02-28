import { createAsyncThunk } from "@reduxjs/toolkit";

import { quickAddTask } from "@/db/repositories/create.repo";
import { RejectWithValue, TaskWithOrderKey } from "@/types/task.types";
import { handleErrorMessage } from "@/utils/handleErrorMessage";

export const quickAddTaskAction = createAsyncThunk<
  { task: TaskWithOrderKey },
  { title: string },
  { rejectValue: RejectWithValue }
>("tasks/quickAdd", async ({ title }, { rejectWithValue }) => {
  try {
    const task = await quickAddTask(title);
    return { task };
  } catch (error: unknown) {
    return rejectWithValue({
      message: handleErrorMessage(error, "Failed to create task"),
    });
  }
});
