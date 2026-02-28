import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  updateTaskOrderKey,
  rebalanceOrderKeys,
} from "@/db/repositories/reorder.repo";
import { OrderTaskItem, RejectWithValue } from "@/types/task.types";
import { handleErrorMessage } from "@/utils/handleErrorMessage";
import { ContainerIdType } from "@/types/create.types";

export const updateTaskOrderKeyAction = createAsyncThunk<
  OrderTaskItem,
  { taskId: string; containerId: ContainerIdType; newOrderKey: number },
  { rejectValue: RejectWithValue }
>(
  "tasks/updateTaskOrderKey",
  async ({ taskId, containerId, newOrderKey }, { rejectWithValue }) => {
    try {
      await updateTaskOrderKey(taskId, containerId, newOrderKey);
      return { id: taskId, order_key: newOrderKey };
    } catch (error) {
      return rejectWithValue({
        message: handleErrorMessage(error, "Failed to update task order key"),
      });
    }
  },
);

export const rebalanceOrderKeysAction = createAsyncThunk<
  { orderArray: OrderTaskItem[]; containerId: ContainerIdType },
  {
    orderArray: OrderTaskItem[];
    containerId: ContainerIdType;
  },
  { rejectValue: RejectWithValue }
>(
  "tasks/rebalanceOrderKeys",
  async ({ orderArray, containerId }, { rejectWithValue }) => {
    try {
      await rebalanceOrderKeys(orderArray, containerId);
      return { orderArray, containerId };
    } catch (error) {
      return rejectWithValue({
        message: handleErrorMessage(error, "Failed to rebalance order keys"),
      });
    }
  },
);
