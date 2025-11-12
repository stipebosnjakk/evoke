import { combineReducers } from "@reduxjs/toolkit";

import taskReducer from "@/store/features/tasks/taskSlice";

const rootReducer = combineReducers({
    tasks: taskReducer
})

export default rootReducer;