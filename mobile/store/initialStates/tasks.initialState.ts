import { TasksState } from "@/types/initialState.types";

export const initialState: TasksState = {
  status: "idle",
  error: null,
  tasks: {
    ids: [],
    byId: {},
  },
  taskOrder: {
    inbox: {},
  },
};
