import { createAsyncThunk } from "@reduxjs/toolkit";

import { createTaskRepo } from "@/db/repositories/create.repo";
import { RejectWithValue } from "@/types/task.types";
import { handleErrorMessage } from "@/utils/handleErrorMessage";
import {
  clearState,
  validateTextInputs,
} from "@/store/tasks/slices/newTask.slice";
import { RootState } from "@/store/store";
import { NewTask } from "@/db";
import {
  getTaskPlacement,
  getTaskScreenHref,
  getTaskScreenText,
} from "@/utils/taskPlacement";
import Toast from "react-native-toast-message";

export const createTaskAction = createAsyncThunk<
  { task: NewTask },
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

    const task = await createTaskRepo(newTask.task);

    if (!task || !task.id) {
      return rejectWithValue({
        message: "Task was not created properly",
      });
    }

    const placement = getTaskPlacement(task);

    Toast.show({
      type: "taskSaved",
      text1: task.title || "Task created",
      text2: getTaskScreenText(placement),
      props: {
        href: getTaskScreenHref(placement),
      },
    });

    dispatch(clearState());

    return { task };
  } catch (error: unknown) {
    return rejectWithValue({
      message: handleErrorMessage(error, "Failed to create task"),
    });
  }
});
