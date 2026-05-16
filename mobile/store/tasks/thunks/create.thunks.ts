import { createAsyncThunk } from "@reduxjs/toolkit";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import { createTaskRepo } from "@/db/repositories/create.repo";
import { RejectWithValue, TaskWithOrderKey } from "@/types/task.types";
import { getErrorMessage } from "@/utils/error";
import {
  clearState,
  validateTextInputs,
} from "@/store/tasks/slices/newTask.slice";
import { RootState } from "@/store/store";
import {
  getTaskPlacement,
  getTaskScreenHref,
  getTaskScreenText,
} from "@/utils/taskPlacement";

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

    const title = newTask.task.title?.trim();

    if (!title) {
      return rejectWithValue({
        message: "Title is required",
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

    dispatch(clearState());

    return res;
  } catch (error: unknown) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to create task"),
    });
  }
});
