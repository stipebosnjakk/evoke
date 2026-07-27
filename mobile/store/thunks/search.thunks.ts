import { createAsyncThunk } from "@reduxjs/toolkit";

import { RejectWithValue } from "@/types/task.types";
import { getErrorMessage } from "@/utils/error";
import {
  SearchResults,
  searchTasksAndProjectsRepo,
} from "@/db/repositories/search.repo";

export const searchTasksAndProjectsAction = createAsyncThunk<
  SearchResults,
  string,
  { rejectValue: RejectWithValue }
>("search/searchTasksAndProjects", async (searchQuery, { rejectWithValue }) => {
  try {
    const search = await searchTasksAndProjectsRepo(searchQuery);
    return search;
  } catch (error: unknown) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to search tasks and projects"),
    });
  }
});
