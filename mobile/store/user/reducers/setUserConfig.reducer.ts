import { PayloadAction } from "@reduxjs/toolkit";
import {
  UserConfig,
  UserState,
  GroupConfig,
  ViewType,
} from "@/types/initialState.types";
import { ScopeScreenId, ScopeGroupId } from "@/types/task.types";

export const setUserConfigLoadingReducer = (state: UserState) => {
  state.status = "loading";
  state.error = null;
};

export const setUserConfigReducer = (
  state: UserState,
  action: PayloadAction<UserConfig>,
) => {
  state.status = "succeeded";
  state.error = null;
  state.config = action.payload;
};

export const setUserConfigErrorReducer = (
  state: UserState,
  action: PayloadAction<string>,
) => {
  state.status = "failed";
  state.error = action.payload;
};

export const clearUserConfigErrorReducer = (state: UserState) => {
  state.error = null;
};

export type UpdateGroupOrderPayload = {
  screenId: ScopeScreenId;
  groupConfig: GroupConfig[];
};

export const updateGroupOrderReducer = (
  state: UserState,
  action: PayloadAction<UpdateGroupOrderPayload>,
) => {
  const { screenId, groupConfig } = action.payload;
  if (!screenId || !groupConfig) return;

  const screen = state.config?.screens[screenId];
  if (!screen) return;

  screen.group_order = groupConfig;
};

export type UpdateIsOpenGroupType = {
  screenId: ScopeScreenId;
  groupId: ScopeGroupId;
  isOpen: boolean;
};

export const updateIsOpenGroupReducer = (
  state: UserState,
  action: PayloadAction<UpdateIsOpenGroupType>,
) => {
  const { screenId, groupId, isOpen } = action.payload;

  if (!screenId || !groupId || isOpen === undefined) return;

  const screen = state.config?.screens[screenId];
  if (!screen) return;

  const group = screen.group_order.find((group) => group.id === groupId);
  if (!group) return;

  group.isOpen = isOpen;
};

export type UpdateScreenViewType = {
  screenId: ScopeScreenId;
  view: ViewType;
};

export const updateScreenViewReducer = (
  state: UserState,
  action: PayloadAction<UpdateScreenViewType>,
) => {
  const { screenId, view } = action.payload;

  if (!screenId || !view) return;

  const screen = state.config?.screens[screenId];

  if (!screen) return;

  screen.view = view;
};
