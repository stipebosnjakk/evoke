import { createAsyncThunk } from "@reduxjs/toolkit";

import { EntityObjectType } from "@/types/initialState.types";
import { ProjectStateData } from "@/types/project.types";
import { RejectWithValue } from "@/types/task.types";
import { getErrorMessage } from "@/utils/error";
import { fetchProjectsRepo } from "@/db/repositories/project/project.fetch.repo";

type ProjectsType = {
  projects: EntityObjectType<ProjectStateData>;
};

export const fetchProjectsAction = createAsyncThunk<
  ProjectsType,
  void,
  { rejectValue: RejectWithValue }
>("projects/fetchProjects", async (_, { rejectWithValue }) => {
  try {
    const projects = await fetchProjectsRepo();
    return { projects };
  } catch (error: unknown) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to get projects"),
    });
  }
});
