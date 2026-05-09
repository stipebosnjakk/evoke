import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  updateTaskOrderKey,
  rebalanceOrderKeys,
} from "@/db/repositories/update.repo";
import {
  OrderTaskItem,
  RejectWithValue,
  ScopeIdType,
} from "@/types/task.types";
import { handleErrorMessage } from "@/utils/handleErrorMessage";

export const updateTaskOrderKeyAction = createAsyncThunk<
  { newOrder: OrderTaskItem; scopeId: ScopeIdType },
  { newOrder: OrderTaskItem; scopeId: ScopeIdType },
  { rejectValue: RejectWithValue }
>(
  "tasks/updateTaskOrderKey",
  async ({ newOrder, scopeId }, { rejectWithValue }) => {
    try {
      await updateTaskOrderKey(newOrder, scopeId);
      return { newOrder, scopeId };
    } catch (error) {
      return rejectWithValue({
        message: handleErrorMessage(error, "Failed to update task order key"),
      });
    }
  },
);

export const rebalanceOrderKeysAction = createAsyncThunk<
  { orderArray: OrderTaskItem[]; scopeId: ScopeIdType },
  {
    orderArray: OrderTaskItem[];
    scopeId: ScopeIdType;
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
        message: handleErrorMessage(error, "Failed to rebalance order keys"),
      });
    }
  },
);
