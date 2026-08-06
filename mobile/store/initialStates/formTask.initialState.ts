import { FormTaskInitialState } from "@/types/initialState.types";

export const initialState: FormTaskInitialState = {
  loading: false,
  error: null,
  inputs: {
    title: null,
    description: null,
  },
  task: {
    title: undefined,
    description: undefined,
    status: undefined,
    start_date: undefined,
    start_time_min: undefined,
    duration_min: undefined,
    deadline: undefined,
    repeat: undefined,
    project_id: undefined,
  },
};
