import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type TasksState = {
  tasks: Task[];
};

const initialState: TasksState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<{ id: string; title: string }>) {
      state.tasks.push({
        id: action.payload.id,
        title: action.payload.title,
        completed: false,
      });
    },
    removeTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
  },
});

export const { addTask, removeTask } = taskSlice.actions;
export default taskSlice.reducer;
