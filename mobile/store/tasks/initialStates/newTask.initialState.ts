import { NewTaskInitialState } from "@/types/initialState.types";

export const initialState: NewTaskInitialState = {
  loading: false,
  error: null,
  inputs: {
    title: null,
    description: null,
  },
  task: {
    title: null,
    description: null,
    status: null,
    start_date: null,
    start_time_min: null,
    duration_min: null,
    deadline: null,
    repeat: null,
  },
};
