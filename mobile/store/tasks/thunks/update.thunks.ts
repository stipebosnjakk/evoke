import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  updateTaskOrderKey,
  rebalanceOrderKeys,
  completeTask,
  restoreCompletedTask,
} from "@/db/repositories/update.repo";
import {
  OrderTaskItem,
  RejectWithValue,
  ScopeScreenId,
} from "@/types/task.types";
import { getErrorMessage } from "@/utils/error";
import { Task } from "@/db";

export const restoreCompletedTaskAction = createAsyncThunk<
  { task: Task },
  { taskId: string },
  { rejectValue: RejectWithValue }
>("tasks/restoreCompletedTask", async ({ taskId }, { rejectWithValue }) => {
  try {
    const task = await restoreCompletedTask(taskId);
    return { task };
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to restore task"),
    });
  }
});

export const completeTaskAction = createAsyncThunk<
  { task: Task },
  { taskId: string },
  { rejectValue: RejectWithValue }
>("tasks/completeTask", async ({ taskId }, { rejectWithValue }) => {
  try {
    const task = await completeTask(taskId);
    return { task };
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to complete task"),
    });
  }
});

export const updateTaskOrderKeyAction = createAsyncThunk<
  { newOrder: OrderTaskItem; scopeId: ScopeScreenId },
  { newOrder: OrderTaskItem; scopeId: ScopeScreenId },
  { rejectValue: RejectWithValue }
>(
  "tasks/updateTaskOrderKey",
  async ({ newOrder, scopeId }, { rejectWithValue }) => {
    try {
      await updateTaskOrderKey(newOrder, scopeId);
      return { newOrder, scopeId };
    } catch (error) {
      return rejectWithValue({
        message: getErrorMessage(error, "Failed to update task order key"),
      });
    }
  },
);

export const rebalanceOrderKeysAction = createAsyncThunk<
  { orderArray: OrderTaskItem[]; scopeId: ScopeScreenId },
  {
    orderArray: OrderTaskItem[];
    scopeId: ScopeScreenId;
  },
  { rejectValue: RejectWithValue }
>(
  "tasks/rebalanceOrderKeys",
  async ({ orderArray, scopeId }, { rejectWithValue }) => {
    try {
      await rebalanceOrderKeys(orderArray, scopeId);
      return { orderArray, scopeId };
    } catch (error) {
      return rejectWithValue({
        message: getErrorMessage(error, "Failed to rebalance order keys"),
      });
    }
  },
);
