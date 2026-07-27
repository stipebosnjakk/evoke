import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "@/store/initialStates/formProject.initialState";
import {
  clearProjectStateReducer,
  setColorReducer,
  setNameReducer,
  validateNameAndColorReducer,
} from "@/store/reducers/formProject.reducer";

const formProjectSlice = createSlice({
  name: "formProject",
  initialState,
  reducers: {
    setName: setNameReducer,
    setColor: setColorReducer,
    validateNameAndColor: validateNameAndColorReducer,
    clearProjectState: clearProjectStateReducer,
  },
});

export const { setName, setColor, validateNameAndColor, clearProjectState } =
  formProjectSlice.actions;

export default formProjectSlice.reducer;
