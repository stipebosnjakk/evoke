import { ProjectsState } from "@/types/initialState.types";

export const initialState: ProjectsState = {
  status: "idle",
  error: null,
  projects: {
    ids: [],
    byId: {},
  },
  projectOrder: {
    main: {},
  },
};
