import { combineReducers } from "@reduxjs/toolkit";

import taskSlice from "@/store/slices/tasks.slice";
import formTaskSlice from "@/store/slices/formTask.slice";
import configSlice from "@/store/slices/config.slice";
import formProjectSlice from "@/store/slices/formProject.slice";
import projectSlice from "@/store/slices/projects.slice";

const rootReducer = combineReducers({
  user: configSlice,
  tasks: taskSlice,
  projects: projectSlice,
  formTask: formTaskSlice,
  formProject: formProjectSlice,
});

export default rootReducer;
