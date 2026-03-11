import { TasksState } from "@/types/initialState.types";

const listsInitialState = {
  ids: [],
  loading: false,
  error: null,
  offset: 0,
  total: 0,
  hasMore: true,
};

export const initialState: TasksState = {
  loading: false,
  error: null,
  containerId: null,
  ui: {
    searchQuery: "",
  },
  tasks: {
    byId: {},
  },
  lists: {
    today: { ...listsInitialState, limit: 100 },
    inbox: { ...listsInitialState, limit: 100 },
    plan: {
      range: {
        preset: "next7",
        startDate: null,
        endDate: null,
      },
      overdue: { ...listsInitialState, limit: 50 },
      inRange: {
        next: { ...listsInitialState, limit: 50 },
        waiting: { ...listsInitialState, limit: 50 },
        someday: { ...listsInitialState, limit: 50 },
      },
    },
  },
};
