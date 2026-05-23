import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "@/store/initialStates/newProject.initialState";
import {
  clearProjectStateReducer,
  setColorReducer,
  setNameReducer,
  validateNameAndColorReducer,
} from "@/store/reducers/createProject.reducer";

const newProjectSlice = createSlice({
  name: "newProject",
  initialState,
  reducers: {
    setName: setNameReducer,
    setColor: setColorReducer,
    validateNameAndColor: validateNameAndColorReducer,
    clearProjectState: clearProjectStateReducer,
  },
});

export const { setName, setColor, validateNameAndColor, clearProjectState } =
  newProjectSlice.actions;

export default newProjectSlice.reducer;
