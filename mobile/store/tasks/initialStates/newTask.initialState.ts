import { NewTaskInitialState } from "@/types/initialState";

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
    due_time_min: null,
    deadline: null,
    repeat: null,
  },
};
