import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { ProjectsState } from "@/types/initialState.types";
import { updateOrderKeysAction } from "@/store/thunks/task/task.order.thunks";

export const addUpdateProjectTaskOrderExtraReducers = (
  builder: ActionReducerMapBuilder<ProjectsState>,
) => {
  builder
    .addCase(updateOrderKeysAction.pending, (state, action) => {
      const { orderArray, scopeId } = action.meta.arg;
      const project = state.projects.byId[scopeId];

      if (!project) return;

      state.error = null;

      const orderByTaskId = new Map(
        orderArray.map((item) => [item.id, item.order_key]),
      );

      for (const task of project.tasks) {
        const orderKey = orderByTaskId.get(task.id);
        if (orderKey !== undefined) {
          task.order_key = orderKey;
        }
      }
    })
    .addCase(updateOrderKeysAction.rejected, (state, action) => {
      const project = state.projects.byId[action.meta.arg.scopeId];

      if (!project) return;

      state.error = action.payload?.message || "Failed to update order keys";
    })
    .addCase(updateOrderKeysAction.fulfilled, (state, action) => {
      const project = state.projects.byId[action.payload.scopeId];

      if (!project) return;

      state.error = null;
    });
};
