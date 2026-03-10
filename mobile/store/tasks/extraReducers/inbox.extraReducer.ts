import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { TasksState } from "@/types/initialState";
import { getInboxTasksAction } from "@/store/tasks/thunks/fetch.thunks";
import { mergeNewListItems } from "./helper";

export const addInboxExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(getInboxTasksAction.pending, (state, action) => {
      state.lists.inbox.loading = true;
      state.lists.inbox.error = null;

      const isRefresh = action.meta.arg.offset === 0;

      // TODO: make a logic for hasMore
      if (isRefresh) {
        state.lists.inbox.ids = [];
        state.lists.inbox.offset = 0;
        state.lists.inbox.total = 0;
        state.lists.inbox.hasMore = true;
      }
    })
    .addCase(getInboxTasksAction.rejected, (state, action) => {
      console.log(action.payload?.message);
      state.lists.inbox.loading = false;
      state.lists.inbox.error =
        action.payload?.message || "Failed to load Inbox tasks";
    })
    .addCase(getInboxTasksAction.fulfilled, (state, action) => {
      state.lists.inbox.loading = false;
      state.lists.inbox.error = null;

      const { data, total } = action.payload;
      for (const task of data) state.tasks.byId[task.id] = task;
      state.lists.inbox.total = total;

      const isRefresh = action.meta.arg.offset === 0;

      mergeNewListItems(state.lists.inbox, data, isRefresh);

      state.lists.inbox.offset = state.lists.inbox.ids.length;
      state.lists.inbox.hasMore = data.length === state.lists.inbox.limit;
    });
};
