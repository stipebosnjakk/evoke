import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  addTasksToProject,
  completeTask,
  restoreCompletedTask,
  updateOrderKeys,
} from "@/db/repositories/update.repo";
import {
  OrderTaskItem,
  RejectWithValue,
  TaskProject,
  TaskStateData,
} from "@/types/task.types";
import { getErrorMessage } from "@/utils/error";
import {
  UpdateGroupOrderPayload,
  UpdateIsOpenGroupType,
  UpdateScreenViewType,
} from "@/store/reducers/createUserConfig.reducer";
import { AppDispatch, RootState } from "@/store/store";
import {
  setUserConfig,
  setUserConfigError,
  updateGroupOrder,
  updateIsOpenGroup,
  updateScreenView,
} from "@/store/slices/config.slice";
import { defaultUserConfig, USER_CONFIG } from "@/constants/config";
import { storeData } from "@/utils/storage";
import { ProjectTask } from "@/types/project.types";

export const restoreCompletedTaskAction = createAsyncThunk<
  { task: TaskStateData },
  { taskId: string },
  { rejectValue: RejectWithValue }
>("tasks/restoreCompletedTask", async ({ taskId }, { rejectWithValue }) => {
  try {
    const task = await restoreCompletedTask(taskId);
    return { task };
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to restore task"),
    });
  }
});

export const completeTaskAction = createAsyncThunk<
  { task: TaskStateData },
  { taskId: string },
  { rejectValue: RejectWithValue }
>("tasks/completeTask", async ({ taskId }, { rejectWithValue }) => {
  try {
    const task = await completeTask(taskId);
    return { task };
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to complete task"),
    });
  }
});

export const updateOrderKeysAction = createAsyncThunk<
  { orderArray: OrderTaskItem[]; scopeId: string },
  { orderArray: OrderTaskItem[]; scopeId: string },
  { rejectValue: RejectWithValue }
>(
  "order/updateOrderKeys",
  async ({ orderArray, scopeId }, { rejectWithValue }) => {
    try {
      await updateOrderKeys(orderArray, scopeId);
      return { orderArray, scopeId };
    } catch (error) {
      return rejectWithValue({
        message: getErrorMessage(error, "Failed to update order keys"),
      });
    }
  },
);

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

export const addTasksToProjectAction = createAsyncThunk<
  {
    projectTasks: ProjectTask[];
    project: TaskProject;
  },
  {
    taskIds: string[];
    projectId: string;
  },
  {
    rejectValue: RejectWithValue;
  }
>(
  "tasks/addTasksToProject",
  async ({ taskIds, projectId }, { rejectWithValue }) => {
    try {
      const data = await addTasksToProject(taskIds, projectId);
      return data;
    } catch (error) {
      return rejectWithValue({
        message: getErrorMessage(error, "Failed to add tasks to project"),
      });
    }
  },
);
// TODO: remove
export const resetUserConfig = () => async (dispatch: AppDispatch) => {
  await storeData(USER_CONFIG, JSON.stringify(defaultUserConfig));
  dispatch(setUserConfig(defaultUserConfig));
};
