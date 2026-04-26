import { TasksState } from "@/types/initialState.types";

export const clearTaskScreenErrorReducer = (state: TasksState) => {
  state.error = null;
};
