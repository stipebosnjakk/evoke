import { ProjectsState, TasksState } from "@/types/initialState.types";

export const clearTaskScreenErrorReducer = (state: TasksState) => {
  state.error = null;
};

export const clearProjectScreenErrorReducer = (state: ProjectsState) => {
  state.error = null;
};
