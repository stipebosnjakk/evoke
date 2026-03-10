import { combineReducers } from "@reduxjs/toolkit";

import taskSlice from "@/store/tasks/slices/tasks.slice";
import newTaskSlice from "@/store/tasks/slices/newTask.slice";

const rootReducer = combineReducers({
  tasks: taskSlice,
  newTask: newTaskSlice,
});

export default rootReducer;
