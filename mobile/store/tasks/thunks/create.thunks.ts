import { createAsyncThunk } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";

import { createTaskRepo } from "@/db/repositories/create.repo";
import { RejectWithValue, TaskWithOrderKey } from "@/types/task.types";
import { handleErrorMessage } from "@/utils/handleErrorMessage";
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

    const res = await createTaskRepo(newTask.task);

    if (!res.task) {
      return rejectWithValue({
        message: "Task was not created properly",
      });
    }

    const placement = getTaskPlacement(res.task);

    Toast.show({
      type: "taskSaved",
      text1: res.task.title || "Task created",
      text2: getTaskScreenText(placement),
      props: {
        href: getTaskScreenHref(placement),
      },
    });

    dispatch(clearState());

    return res;
  } catch (error: unknown) {
    return rejectWithValue({
      message: handleErrorMessage(error, "Failed to create task"),
    });
  }
});
