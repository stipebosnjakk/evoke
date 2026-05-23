import { combineReducers } from "@reduxjs/toolkit";

import taskSlice from "@/store/slices/tasks.slice";
import newTaskSlice from "@/store/slices/newTask.slice";
import configSlice from "@/store/slices/config.slice";
import newProjectSlice from "@/store/slices/newProject.slice";
import projectSlice from "@/store/slices/projects.slice";

const rootReducer = combineReducers({
  user: configSlice,
  tasks: taskSlice,
  projects: projectSlice,
  newTask: newTaskSlice,
  newProject: newProjectSlice,
});

export default rootReducer;
