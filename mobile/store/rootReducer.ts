import { combineReducers } from "@reduxjs/toolkit";

import taskSlice from "@/store/tasks/tasks.slice";

const rootReducer = combineReducers({
  tasks: taskSlice,
});

export default rootReducer;
