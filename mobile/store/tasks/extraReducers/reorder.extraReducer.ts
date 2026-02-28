import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { TasksState } from "@/types/initialState";
import {
  rebalanceOrderKeysAction,
  updateTaskOrderKeyAction,
} from "@/store/tasks/thunks/reorder.thunks";
import { getListByContainerId } from "./helper";

export const addReorderExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(updateTaskOrderKeyAction.rejected, (state, action) => {
      const list = getListByContainerId(state, action.meta.arg.containerId);
      if (!list) {
        state.error =
          "List not found for container ID: " + action.meta.arg.containerId;
        return;
      }

      list.error = action.payload?.message || "Failed to update task order key";
    })
    .addCase(updateTaskOrderKeyAction.fulfilled, (state, action) => {
      const list = getListByContainerId(state, action.meta.arg.containerId);

      if (!list) {
        state.error =
          "List not found for container ID: " + action.meta.arg.containerId;
        return;
      }

      state.error = null;
      list.error = null;
      list.ids = list.ids
        .map((item) => {
          if (item.id === action.payload.id) {
            return { ...item, order_key: action.payload.order_key };
          }
          return item;
        })
        .sort((a, b) => b.order_key - a.order_key);
    })
    .addCase(rebalanceOrderKeysAction.pending, (state) => {
      const list = getListByContainerId(state, state.containerId ?? "");

      if (!list) {
        state.error = "List not found for container ID: " + state.containerId;
        return;
      }
      list.error = null;
      state.error = null;
    })
    .addCase(rebalanceOrderKeysAction.rejected, (state, action) => {
      const message =
        action.payload?.message || "Failed to rebalance order keys";
      const list = getListByContainerId(state, state.containerId ?? "");

      if (!list) {
        state.error = message;
        return;
      }
      list.error = message;
    })
    .addCase(rebalanceOrderKeysAction.fulfilled, (state, action) => {
      const list = getListByContainerId(state, action.payload.containerId);

      if (!list) {
        state.error =
          "List not found for container ID: " + action.payload.containerId;
        return;
      }

      list.error = null;
      state.error = null;

      const { orderArray, containerId } = action.payload;
      if (containerId !== state.containerId) return;
      if (orderArray.length === 0) return;

      if (orderArray.length === list.ids.length) {
        list.ids = orderArray;
      }

      for (const item of orderArray) {
        const index = list.ids.findIndex((x) => x.id === item.id);
        if (index !== -1) {
          list.ids[index].order_key = item.order_key;
        }
      }
    });
};
