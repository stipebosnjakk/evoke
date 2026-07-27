import { createAsyncThunk } from "@reduxjs/toolkit";
import { INBOX_SCOPE_ID } from "@/constants/scopeIds";
import { EntityObjectType, OrderObject } from "@/types/initialState.types";
import { RejectWithValue, TaskStateData } from "@/types/task.types";
import { getErrorMessage } from "@/utils/error";
import { fetchActiveTasksRepo } from "@/db/repositories/task/task.fetch.repo";
import { fetchScopeOrderRepo } from "@/db/repositories/order.repo";

type ActiveTasksType = {
  tasks: EntityObjectType<TaskStateData>;
  inboxOrder: OrderObject;
};

type ActiveTasksReturnType = {
  refresh?: boolean;
};

export const fetchActiveTasksAction = createAsyncThunk<
  ActiveTasksType,
  ActiveTasksReturnType,
  { rejectValue: RejectWithValue }
>("tasks/fetchActiveTasks", async (_, { rejectWithValue }) => {
  try {
    const [tasks, inboxOrder] = await Promise.all([
      fetchActiveTasksRepo(),
      fetchScopeOrderRepo(INBOX_SCOPE_ID),
    ]);
    return { tasks, inboxOrder };
  } catch (error: unknown) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to get active tasks"),
    });
  }
});
