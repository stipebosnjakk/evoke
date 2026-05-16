import { createAsyncThunk } from "@reduxjs/toolkit";

import { RejectWithValue } from "@/types/task.types";
import { getErrorMessage } from "@/utils/error";
import {
  fetchActiveTasks,
  fetchScopeOrder,
} from "@/db/repositories/fetch.repo";
import { ScopeType, TasksObjectType } from "@/types/initialState.types";
import { INBOX_SCOPE_ID } from "@/constants/scopeIds";

type ActiveTasksType = {
  tasks: TasksObjectType;
  inboxOrder: ScopeType;
};

export const getActiveTasksAction = createAsyncThunk<
  ActiveTasksType,
  { refresh?: boolean },
  { rejectValue: RejectWithValue }
>("tasks/fetchActiveTasks", async (_, { rejectWithValue }) => {
  try {
    const [tasks, inboxOrder] = await Promise.all([
      fetchActiveTasks(),
      fetchScopeOrder(INBOX_SCOPE_ID),
    ]);
    return { tasks, inboxOrder };
  } catch (error: unknown) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to get active tasks"),
    });
  }
});
