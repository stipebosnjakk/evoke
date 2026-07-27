import { createSlice } from "@reduxjs/toolkit";

import { initialState } from "@/store/initialStates/config.initialState";
import {
  clearUserConfigErrorReducer,
  updateGroupOrderReducer,
  setUserConfigErrorReducer,
  setUserConfigLoadingReducer,
  setUserConfigReducer,
  updateIsOpenGroupReducer,
  updateScreenViewReducer,
} from "@/store/reducers/formUserConfig.reducer";

const configSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserConfigLoading: setUserConfigLoadingReducer,
    setUserConfig: setUserConfigReducer,
    setUserConfigError: setUserConfigErrorReducer,
    updateGroupOrder: updateGroupOrderReducer,
    updateScreenView: updateScreenViewReducer,
    updateIsOpenGroup: updateIsOpenGroupReducer,
    clearUserConfigError: clearUserConfigErrorReducer,
  },
});

export const {
  setUserConfigLoading,
  setUserConfig,
  setUserConfigError,
  updateGroupOrder,
  updateScreenView,
  updateIsOpenGroup,
  clearUserConfigError,
} = configSlice.actions;

export default configSlice.reducer;
