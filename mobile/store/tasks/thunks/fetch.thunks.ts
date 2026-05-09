import { createAsyncThunk } from "@reduxjs/toolkit";

import { RejectWithValue } from "@/types/task.types";
import { handleErrorMessage } from "@/utils/handleErrorMessage";
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

    console.log("TASKS: ", JSON.stringify(tasks, null ,2))
    console.log("ORDER: ", JSON.stringify(inboxOrder, null ,2))
    return { tasks, inboxOrder };
  } catch (error: unknown) {
    return rejectWithValue({
      message: handleErrorMessage(error, "Failed to get active tasks"),
    });
  }
});
