import { createAsyncThunk } from "@reduxjs/toolkit";

import { tasks } from "@/db/schemas/task.schema";
import { db } from "@/db/client";
import { RejectWithValue } from "@/types/task.types";
import { handleErrorMessage } from "@/utils/handleErrorMessage";
import { list_order } from "@/db";

export const deleteAllTasksAction = createAsyncThunk<
  void,
  void,
  { rejectValue: RejectWithValue }
>("tasks/deleteAll", async (_, { rejectWithValue }) => {
  try {
    await db.delete(tasks);
    await db.delete(list_order);
  } catch (error: unknown) {
    return rejectWithValue({
      message: handleErrorMessage(error, "Failed to delete all tasks"),
    });
  }
});
