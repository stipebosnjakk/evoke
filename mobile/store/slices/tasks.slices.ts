import { createSlice } from "@reduxjs/toolkit";

import { fetchInboxTasks } from "@/store/actions/tasks.actions";
import { TasksState } from "@/types/create.types";

const initialState: TasksState = {
  loading: false,
  error: null,
  ui: {
    activeView: null,
    searchQuery: "",
  },
  tasks: {
    byId: {},
  },
  lists: {
    today: {
      ids: [],
      loading: false,
      error: null,
      limit: 100,
      offset: 0,
      total: 0,
      hasMore: true,
    },
    inbox: {
      ids: [],
      loading: false,
      error: null,
      limit: 100,
      offset: 0,
      total: 0,
      hasMore: true,
    },
    plan: {
      range: {
        preset: "next7",
        startDate: null,
        endDate: null,
      },
      overdue: {
        ids: [],
        loading: false,
        error: null,
        limit: 50,
        offset: 0,
        total: 0,
        hasMore: true,
      },
      inRange: {
        next: {
          ids: [],
          loading: false,
          error: null,
          limit: 50,
          offset: 0,
          total: 0,
          hasMore: true,
        },
        waiting: {
          ids: [],
          loading: false,
          error: null,
          limit: 50,
          offset: 0,
          total: 0,
          hasMore: true,
        },
        someday: {
          ids: [],
          loading: false,
          error: null,
          limit: 50,
          offset: 0,
          total: 0,
          hasMore: true,
        },
      },
    },
  },
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchInboxTasks.pending, (state, action) => {
      state.lists.inbox.loading = true;
      state.lists.inbox.error = null;

      if (action.meta.arg.offset === 0) {
        state.lists.inbox.ids = [];
        state.lists.inbox.offset = 0;
        state.lists.inbox.total = 0;
        state.lists.inbox.hasMore = true;
      }
    });
    builder
      .addCase(fetchInboxTasks.rejected, (state, action) => {
        state.lists.inbox.loading = false;
        state.lists.inbox.error =
          action.payload?.errorMessage ??
          action.error.message ??
          "Something went wrong";
      })
      .addCase(fetchInboxTasks.fulfilled, (state, action) => {
        state.lists.inbox.loading = false;
        state.lists.inbox.error = null;

        const { data, total } = action.payload;
        for (const t of data) state.tasks.byId[t.id] = t;
        state.lists.inbox.total = total;

        const newIds = data.map((t) => t.id);
        const base =
          state.lists.inbox.offset === 0 ? [] : state.lists.inbox.ids;
        const merged = base.concat(newIds);

        const seen = new Set<string>();
        state.lists.inbox.ids = merged.filter((id) => {
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        });

        state.lists.inbox.offset = state.lists.inbox.ids.length;
        state.lists.inbox.hasMore = data.length === state.lists.inbox.limit;
      });
  },
});

export default taskSlice.reducer;
