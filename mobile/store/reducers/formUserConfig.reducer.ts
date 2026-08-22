import { PayloadAction } from "@reduxjs/toolkit";

import { UserState } from "@/types/initialState.types";
import { GroupConfig } from "@/types/group.types";
import { UserConfig, ViewType } from "@/types/config.types";
import { ScopeGroupId, ScopeScreenId } from "@/types/scope.types";

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
  scopeId: ScopeScreenId;
  groupConfig: GroupConfig[];
};

export const updateGroupOrderReducer = (
  state: UserState,
  action: PayloadAction<UpdateGroupOrderPayload>,
) => {
  const { scopeId, groupConfig } = action.payload;
  if (!scopeId || !groupConfig) return;

  const screen = state.config?.screens[scopeId];
  if (!screen) return;

  screen.group_order = groupConfig;
};

export type UpdateIsOpenGroupType = {
  scopeId: ScopeScreenId;
  groupId: ScopeGroupId;
  isOpen: boolean;
};

export const updateIsOpenGroupReducer = (
  state: UserState,
  action: PayloadAction<UpdateIsOpenGroupType>,
) => {
  const { scopeId, groupId, isOpen } = action.payload;

  if (!scopeId || !groupId || isOpen === undefined) return;

  const screen = state.config?.screens[scopeId];
  if (!screen) return;

  const group = screen.group_order.find((group) => group.id === groupId);
  if (!group) return;

  group.isOpen = isOpen;
};

export type UpdateScreenViewType = {
  scopeId: ScopeScreenId;
  view: ViewType;
};

export const updateScreenViewReducer = (
  state: UserState,
  action: PayloadAction<UpdateScreenViewType>,
) => {
  const { scopeId, view } = action.payload;

  if (!scopeId || !view) return;

  const screen = state.config?.screens[scopeId];

  if (!screen) return;

  screen.view = view;
};

export const updateHasLaunchedReducer = (state: UserState) => {
  const config = state.config;

  if (!config) return;

  config.has_launched = "launched";
};
