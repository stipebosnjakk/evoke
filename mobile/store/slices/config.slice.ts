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
  updateHasLaunchedReducer,
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
    updateHasLaunched: updateHasLaunchedReducer,
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
  updateHasLaunched,
  clearUserConfigError,
} = configSlice.actions;

export default configSlice.reducer;
