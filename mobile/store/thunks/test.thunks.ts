import { createAsyncThunk } from "@reduxjs/toolkit";
import * as SQLite from "expo-sqlite";

import { tasks } from "@/db/schemas/task.schema";
import { db, expo } from "@/db/client";
import { RejectWithValue } from "@/types/task.types";
import { getErrorMessage } from "@/utils/error";
import { list_order, projects } from "@/db";

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
