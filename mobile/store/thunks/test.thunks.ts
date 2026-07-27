import { createAsyncThunk } from "@reduxjs/toolkit";
import * as SQLite from "expo-sqlite";

import { expo } from "@/db/client";
import { RejectWithValue } from "@/types/task.types";
import { getErrorMessage } from "@/utils/error";
import { AppDispatch } from "@/store/store";
import { defaultUserConfig, USER_CONFIG } from "@/constants/config";
import { setUserConfig } from "@/store/slices/config.slice";
import { storeData } from "@/utils/storage";

export const deleteAllTasksAction = createAsyncThunk<
  void,
  void,
  { rejectValue: RejectWithValue }
>("tasks/deleteAll", async (_, { rejectWithValue }) => {
  try {
    await expo.closeAsync();
    await SQLite.deleteDatabaseAsync(process.env.EXPO_PUBLIC_DATABASE_NAME!);
  } catch (error: unknown) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to delete all tasks"),
    });
  }
});

export const resetUserConfig = () => async (dispatch: AppDispatch) => {
  await storeData(USER_CONFIG, JSON.stringify(defaultUserConfig));
  dispatch(setUserConfig(defaultUserConfig));
};
