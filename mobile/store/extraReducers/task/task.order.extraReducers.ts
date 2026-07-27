import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { INBOX_SCOPE_ID } from "@/constants/scopeIds";
import { TasksState } from "@/types/initialState.types";
import { updateOrderKeysAction } from "@/store/thunks/task/task.order.thunks";

export const addUpdateInboxOrderExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(updateOrderKeysAction.pending, (state, action) => {
      const { orderArray, scopeId } = action.meta.arg;
      if (scopeId !== INBOX_SCOPE_ID) return;
      state.error = null;
      for (const item of orderArray) {
        state.taskOrder.inbox[item.id] = item.order_key;
      }
    })
    .addCase(updateOrderKeysAction.rejected, (state, action) => {
      if (action.meta.arg.scopeId !== INBOX_SCOPE_ID) return;
      state.error = action.payload?.message || "Failed to update order keys";
    })
    .addCase(updateOrderKeysAction.fulfilled, (state, action) => {
      if (action.payload.scopeId !== INBOX_SCOPE_ID) return;
      state.error = null;
    });
};
