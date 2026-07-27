import { createAsyncThunk } from "@reduxjs/toolkit";

import { getErrorMessage } from "@/utils/error";
import { RejectWithValue, TaskProject } from "@/types/task.types";
import { ProjectTask } from "@/types/project.types";
import {
  assignTasksToProjectRepo,
  unassignTaskFromProjectRepo,
  UnassignProjectFromTaskReturnType,
} from "@/db/repositories/task/task.project.repo";

type TasksToProjectActionType = {
  projectTasks: ProjectTask[];
  project: TaskProject;
};

type TasksToProjectActionReturnType = {
  taskIds: string[];
  projectId: string;
};

export const addTasksToProjectAction = createAsyncThunk<
  TasksToProjectActionType,
  TasksToProjectActionReturnType,
  {
    rejectValue: RejectWithValue;
  }
>(
  "tasks/addTasksToProject",
  async ({ taskIds, projectId }, { rejectWithValue }) => {
    try {
      const data = await assignTasksToProjectRepo(taskIds, projectId);
      return data;
    } catch (error) {
      return rejectWithValue({
        message: getErrorMessage(error, "Failed to add tasks to project"),
      });
    }
  },
);

type RemoveTaskFromProjectReturnType = {
  taskId: string;
};

export const removeTaskFromProjectAction = createAsyncThunk<
  UnassignProjectFromTaskReturnType,
  RemoveTaskFromProjectReturnType,
  { rejectValue: RejectWithValue }
>("tasks/removeTaskFromProject", async ({ taskId }, { rejectWithValue }) => {
  try {
    const data = await unassignTaskFromProjectRepo(taskId);
    return data;
  } catch (error) {
    return rejectWithValue({
      message: getErrorMessage(error, "Failed to remove task from project"),
    });
  }
});
