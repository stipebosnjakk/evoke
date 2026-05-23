import { createAsyncThunk } from "@reduxjs/toolkit";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import {
  createProjectRepo,
  createTaskRepo,
} from "@/db/repositories/create.repo";
import { RejectWithValue, TaskWithOrderKey } from "@/types/task.types";
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

export const createTaskAction = createAsyncThunk<
  TaskWithOrderKey,
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

    const handleNavigation = () => {
      router.dismissTo(getTaskScreenHref(placement) as any);
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

    Toast.show({
      type: "info",
      text1: res.project.name || "Project created",
      text2: "Project created successfully",
    });

    dispatch(clearProjectState());

    return res;
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to create a project"),
    });
  }
});
