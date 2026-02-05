import { combineReducers } from "@reduxjs/toolkit";

import taskReducer from "@/store/slices/tasks.slices";

const rootReducer = combineReducers({
  tasks: taskReducer,
});

export default rootReducer;
