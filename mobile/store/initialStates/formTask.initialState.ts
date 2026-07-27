import { FormTaskInitialState } from "@/types/initialState.types";

export const initialState: FormTaskInitialState = {
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
    project_id: null,
  },
};
