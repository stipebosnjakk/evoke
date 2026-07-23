import { createAsyncThunk } from "@reduxjs/toolkit";

import {
  addTasksToProjectRepo,
  completeProjectRepo,
  CompleteProjectReturnType,
  completeTaskRepo,
  deleteProjectRepo,
  DeleteProjectReturnType,
  restoreCompletedRepeatTaskRepo,
  restoreCompletedTaskRepo,
  updateOrderKeysRepo,
  updateProjectRepo,
  UpdateProjectReturnType,
} from "@/db/repositories/mutation.repo";
import {
  IsoDate,
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
import { validateNameAndColor } from "@/store/slices/newProject.slice";

export const restoreCompletedTaskAction = createAsyncThunk<
  { task: TaskStateData },
  { taskId: string },
  { rejectValue: RejectWithValue }
>("tasks/restoreCompletedTask", async ({ taskId }, { rejectWithValue }) => {
  try {
    const task = await restoreCompletedTaskRepo(taskId);
    return { task };
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to restore task"),
    });
  }
});

export const restoreCompletedRepeatTaskAction = createAsyncThunk<
  {
    taskId: string;
  },
  {
    taskId: string;
    completionDate: IsoDate;
  },
  {
    rejectValue: RejectWithValue;
  }
>(
  "tasks/restoreCompletedRepeatTask",
  async ({ taskId, completionDate }, { rejectWithValue }) => {
    try {
      await restoreCompletedRepeatTaskRepo(taskId, completionDate);

      return {
        taskId,
      };
    } catch (error) {
      return rejectWithValue({
        message: getErrorMessage(error, "Failed to restore repeating task"),
      });
    }
  },
);

export const completeTaskAction = createAsyncThunk<
  { task: TaskStateData },
  { taskId: string },
  { rejectValue: RejectWithValue }
>("tasks/completeTask", async ({ taskId }, { rejectWithValue }) => {
  try {
    const task = await completeTaskRepo(taskId);
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
      await updateOrderKeysRepo(orderArray, scopeId);
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
      const data = await addTasksToProjectRepo(taskIds, projectId);
      return data;
    } catch (error) {
      return rejectWithValue({
        message: getErrorMessage(error, "Failed to add tasks to project"),
      });
    }
  },
);

type ProjectId = string | undefined;

export const updateProjectAction = createAsyncThunk<
  UpdateProjectReturnType,
  ProjectId,
  {
    state: RootState;
    rejectValue: RejectWithValue;
  }
>(
  "projects/updateProject",
  async (projectId, { dispatch, getState, rejectWithValue }) => {
    try {
      await dispatch(validateNameAndColor());

      const state = getState();
      const { newProject } = state;

      if (newProject.error) {
        return rejectWithValue({
          message: newProject.error,
        });
      }

      if (!projectId) {
        return rejectWithValue({
          message: "Project ID is required",
        });
      }

      const res = await updateProjectRepo({
        id: projectId,
        name: newProject.project.name,
        color: newProject.project.color,
      });

      if (!res.project) {
        return rejectWithValue({
          message: "Project was not updated properly",
        });
      }

      return res;
    } catch (error) {
      return rejectWithValue({
        message: getErrorMessage(error, "Failed to update project"),
      });
    }
  },
);

type CompleteProjectActionType = {
  projectId: ProjectId;
};

export const completeProjectAction = createAsyncThunk<
  CompleteProjectReturnType,
  CompleteProjectActionType,
  {
    state: RootState;
    rejectValue: RejectWithValue;
  }
>("projects/completeProject", async ({ projectId }, { rejectWithValue }) => {
  try {
    if (!projectId) {
      return rejectWithValue({
        message: "Project ID is required",
      });
    }

    const data = await completeProjectRepo(projectId);
    return data;
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to complete project"),
    });
  }
});

type DeleteProjectActionType = {
  projectId: ProjectId;
};

export const deleteProjectAction = createAsyncThunk<
  DeleteProjectReturnType,
  DeleteProjectActionType,
  {
    rejectValue: RejectWithValue;
  }
>("projects/deleteProject", async ({ projectId }, { rejectWithValue }) => {
  try {
    if (!projectId) {
      return rejectWithValue({
        message: "Project ID is required",
      });
    }
    const data = await deleteProjectRepo(projectId);
    return data;
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to delete project"),
    });
  }
});

// TODO: remove
export const resetUserConfig = () => async (dispatch: AppDispatch) => {
  await storeData(USER_CONFIG, JSON.stringify(defaultUserConfig));
  dispatch(setUserConfig(defaultUserConfig));
};
