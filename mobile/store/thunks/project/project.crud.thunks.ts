import { createAsyncThunk } from "@reduxjs/toolkit";

import { RootState } from "@/store/store";
import { ProjectWithOrderKey } from "@/types/project.types";
import { RejectWithValue } from "@/types/task.types";
import { getErrorMessage } from "@/utils/error";
import {
  createProjectRepo,
  updateProjectRepo,
  UpdateProjectReturnType,
  deleteProjectRepo,
  DeleteProjectReturnType,
} from "@/db/repositories/project/project.crud.repo";

export const createProjectAction = createAsyncThunk<
  ProjectWithOrderKey,
  void,
  { rejectValue: RejectWithValue }
>("projects/create", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as RootState;
    const { formProject } = state;

    if (formProject.error) {
      return rejectWithValue({
        message: formProject.error,
      });
    }

    const res = await createProjectRepo(formProject.project);

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

type ProjectId = string | undefined;

export const updateProjectAction = createAsyncThunk<
  UpdateProjectReturnType,
  ProjectId,
  {
    state: RootState;
    rejectValue: RejectWithValue;
  }
>(
  "projects/updateProject",
  async (projectId, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState();
      const { formProject } = state;

      if (formProject.error) {
        return rejectWithValue({
          message: formProject.error,
        });
      }

      if (!projectId) {
        return rejectWithValue({
          message: "Project ID is required",
        });
      }

      const res = await updateProjectRepo({
        id: projectId,
        name: formProject.project.name,
        color: formProject.project.color,
      });

      if (!res.project) {
        return rejectWithValue({
          message: "Project was not updated properly",
        });
      }

      return res;
    } catch (error) {
      return rejectWithValue({
        message: getErrorMessage(error, "Failed to update project"),
      });
    }
  },
);

type DeleteProjectActionType = {
  projectId: ProjectId;
};

export const deleteProjectAction = createAsyncThunk<
  DeleteProjectReturnType,
  DeleteProjectActionType,
  {
    rejectValue: RejectWithValue;
  }
>("projects/deleteProject", async ({ projectId }, { rejectWithValue }) => {
  try {
    if (!projectId) {
      return rejectWithValue({
        message: "Project ID is required",
      });
    }
    const data = await deleteProjectRepo(projectId);
    return data;
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to delete project"),
    });
  }
});
