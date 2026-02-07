import { createSlice } from "@reduxjs/toolkit";

import { Task } from "@/db/schema/index";
import { fetchAllTasks, quickAddTask } from "@/store/actions/tasks.actions";

type TasksState = {
  tasks: Task[];
  loading: boolean;
  error: string | null;
};

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

// TODO: return better error messages

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to load tasks";
      })
      .addCase(quickAddTask.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(quickAddTask.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.tasks.unshift(action.payload);
      })
      .addCase(quickAddTask.rejected, (state) => {
        state.loading = false;
        state.error = "Failed to add task";
      });
  },
});

export default taskSlice.reducer;
