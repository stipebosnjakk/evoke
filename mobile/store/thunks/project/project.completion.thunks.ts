import {
  completeProjectRepo,
  CompleteProjectReturnType,
} from "@/db/repositories/project/project.completion.repo";
import { RootState } from "@/store/store";
import { RejectWithValue } from "@/types/task.types";
import { getErrorMessage } from "@/utils/error";
import { createAsyncThunk } from "@reduxjs/toolkit";

type CompleteProjectActionType = {
  projectId: string | undefined;
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
