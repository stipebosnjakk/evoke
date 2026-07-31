import { createAsyncThunk } from "@reduxjs/toolkit";

import { getErrorMessage } from "@/utils/error";
import { OrderTaskItem, RejectWithValue } from "@/types/task.types";
import { updateTaskOrderKeysRepo } from "@/db/repositories/task/task.order.repo";

type updateOrderKeysType = {
  orderArray: OrderTaskItem[];
  scopeId: string;
};

export const updateOrderKeysAction = createAsyncThunk<
  updateOrderKeysType,
  updateOrderKeysType,
  { rejectValue: RejectWithValue }
>(
  "order/updateOrderKeys",
  async ({ orderArray, scopeId }, { rejectWithValue }) => {
    try {
      const res = await updateTaskOrderKeysRepo(orderArray, scopeId);
      return res;
    } catch (error) {
      return rejectWithValue({
        message: getErrorMessage(error, "Failed to update order keys"),
      });
    }
  },
);
