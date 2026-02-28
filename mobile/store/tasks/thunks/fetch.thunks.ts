import { createAsyncThunk } from "@reduxjs/toolkit";

import { fetchInboxTasks } from "@/db/repositories/fetch.repo";
import { DataReturnType, RejectWithValue } from "@/types/task.types";
import { handleErrorMessage } from "@/utils/handleErrorMessage";

export const getInboxTasksAction = createAsyncThunk<
  DataReturnType,
  { limit: number; offset: number },
  { rejectValue: RejectWithValue }
>("tasks/fetchInbox", async ({ limit, offset }, { rejectWithValue }) => {
  try {
    const { data, total } = await fetchInboxTasks(limit, offset);
    return {
      data,
      total,
    };
  } catch (error: unknown) {
    return rejectWithValue({
      message: handleErrorMessage(error, "Failed to get Inbox tasks"),
    });
  }
});
