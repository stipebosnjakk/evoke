import { combineReducers } from "@reduxjs/toolkit";

import taskSlice from "@/store/tasks/slices/tasks.slice";
import newTaskSlice from "@/store/tasks/slices/newTask.slice";
import configSlice from "@/store/user/slices/config.slice";

const rootReducer = combineReducers({
  user: configSlice,
  tasks: taskSlice,
  newTask: newTaskSlice,
});

export default rootReducer;
