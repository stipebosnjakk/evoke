import { createSlice } from "@reduxjs/toolkit";

import { Task } from "@/db/schema/index";
import { quickAddTask } from "@/store/actions/tasks.actions";

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

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
