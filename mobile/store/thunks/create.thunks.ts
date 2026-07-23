import { createAsyncThunk } from "@reduxjs/toolkit";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import {
  createProjectRepo,
  RepeatTaskCompletionRepo,
  createTaskRepo,
} from "@/db/repositories/create.repo";
import { CreatedTask, IsoDate, RejectWithValue } from "@/types/task.types";
import { getErrorMessage } from "@/utils/error";
import {
  clearTaskState,
  validateTextInputs,
} from "@/store/slices/newTask.slice";
import { RootState } from "@/store/store";
import {
  getTaskPlacement,
  getTaskScreenHref,
  getTaskScreenText,
} from "@/utils/taskPlacement";
import { ProjectWithOrderKey } from "@/types/project.types";
import {
  validateNameAndColor,
  clearProjectState,
} from "@/store/slices/newProject.slice";
import { routes } from "@/constants/routes";

export const createTaskAction = createAsyncThunk<
  CreatedTask,
  void,
  { rejectValue: RejectWithValue }
>("tasks/create", async (_, { dispatch, getState, rejectWithValue }) => {
  try {
    await dispatch(validateTextInputs());

    const state = getState() as RootState;
    const { newTask } = state;

    if (newTask.error) {
      return rejectWithValue({
        message: newTask.error,
      });
    }

    const res = await createTaskRepo(newTask.task);

    if (!res.task) {
      return rejectWithValue({
        message: "Task was not created properly",
      });
    }

    const placement = getTaskPlacement(res.task);
    const href = getTaskScreenHref(placement);

    const handleNavigation = () => {
      Toast.hide();
      router.dismissTo(href as any);
    };

    Toast.show({
      type: "info",
      text1: res.task.title || "Task created",
      text2: getTaskScreenText(placement),
      props: {
        onPress: handleNavigation,
        icon: "chevron.right",
      },
    });

    dispatch(clearTaskState());

    return res;
  } catch (error: unknown) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to create task"),
    });
  }
});

export const createProjectAction = createAsyncThunk<
  ProjectWithOrderKey,
  void,
  { rejectValue: RejectWithValue }
>("projects/create", async (_, { dispatch, getState, rejectWithValue }) => {
  try {
    await dispatch(validateNameAndColor());

    const state = getState() as RootState;
    const { newProject } = state;

    if (newProject.error) {
      return rejectWithValue({
        message: newProject.error,
      });
    }

    const res = await createProjectRepo(newProject.project);

    if (!res.project) {
      return rejectWithValue({
        message: "Project was not created properly",
      });
    }

    return res;
  } catch (error: unknown) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to create a project"),
    });
  }
});

type RepeatTaskCompletionReturn = {
  taskId: string;
};

type RepeatTaskCompletion = {
  taskId: string;
  completionDate: IsoDate;
};

export const RepeatTaskCompletionAction = createAsyncThunk<
  RepeatTaskCompletionReturn,
  RepeatTaskCompletion,
  { rejectValue: RejectWithValue }
>(
  "RepeatTaskCompletions/create",
  async ({ taskId, completionDate }, { rejectWithValue }) => {
    try {
      if (!taskId) {
        return rejectWithValue({
          message: "Task ID is required",
        });
      }

      await RepeatTaskCompletionRepo(taskId, completionDate);

      return {
        taskId,
      };
    } catch (error: unknown) {
      return rejectWithValue({
        message: getErrorMessage(error, "Failed to complete repeating task"),
      });
    }
  },
);
