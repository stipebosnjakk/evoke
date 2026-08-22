import { AppDispatch, RootState } from "@/store/store";
import { getErrorMessage } from "@/utils/error";
import {
  updateGroupOrder,
  setUserConfigError,
  updateIsOpenGroup,
  updateScreenView,
  updateHasLaunched,
} from "@/store/slices/config.slice";
import { storeData } from "@/utils/storage";
import { USER_CONFIG } from "@/constants/config";
import {
  UpdateGroupOrderPayload,
  UpdateIsOpenGroupType,
  UpdateScreenViewType,
} from "@/store/reducers/formUserConfig.reducer";

export const updateGroupOrderAction =
  (payload: UpdateGroupOrderPayload) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const { scopeId, groupConfig } = payload;
      dispatch(updateGroupOrder({ scopeId, groupConfig }));

      const config = getState().user.config;
      await storeData(USER_CONFIG, JSON.stringify(config));
    } catch (error) {
      const message = getErrorMessage(error, "Failed to update group order");
      dispatch(setUserConfigError(message));
    }
  };

export const updateIsOpenGroupAction =
  (payload: UpdateIsOpenGroupType) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const { scopeId, groupId, isOpen } = payload;
      dispatch(updateIsOpenGroup({ scopeId, groupId, isOpen }));

      const config = getState().user.config;
      await storeData(USER_CONFIG, JSON.stringify(config));
    } catch (error) {
      const message = getErrorMessage(error, "Failed to toggle group");
      dispatch(setUserConfigError(message));
    }
  };

export const updateScreenViewAction =
  (payload: UpdateScreenViewType) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const { scopeId, view } = payload;
      dispatch(updateScreenView({ scopeId, view }));

      const config = getState().user.config;
      await storeData(USER_CONFIG, JSON.stringify(config));
    } catch (error) {
      const message = getErrorMessage(error, "Failed to update view");
      dispatch(setUserConfigError(message));
    }
  };

export const updateHasLaunchedAction =
  () => async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const config = getState().user.config;

      if (config && config.has_launched === "not_launched") {
        const updatedConfig = {
          ...config,
          has_launched: "launched",
        };

        await storeData(USER_CONFIG, JSON.stringify(updatedConfig));
        dispatch(updateHasLaunched());
      }
    } catch (error) {
      const message = getErrorMessage(error, "Failed to update view");
      dispatch(setUserConfigError(message));
    }
  };
