import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { ProjectsState } from "@/types/initialState.types";
import {
  addTasksToProjectAction,
  removeTaskFromProjectAction,
} from "@/store/thunks/project/project.tasks.thunks";
import {
  createTaskAction,
  deleteTaskAction,
  updateTaskAction,
} from "@/store/thunks/task/task.crud.thunks";

export const addTasksToProjectExtraReducers = (
  builder: ActionReducerMapBuilder<ProjectsState>,
) => {
  builder
    .addCase(addTasksToProjectAction.pending, (state) => {
      state.error = null;
    })
    .addCase(addTasksToProjectAction.rejected, (state, action) => {
      state.error = action.payload?.message || "Failed to add tasks to project";
    })
    .addCase(addTasksToProjectAction.fulfilled, (state, action) => {
      const { projectTasks, project } = action.payload;

      const stateProject = state.projects.byId[project.id];

      if (!stateProject) return;

      state.error = null;

      const addedTaskIds = new Set(projectTasks.map((task) => task.id));

      stateProject.tasks = [
        ...projectTasks,
        ...stateProject.tasks.filter((task) => !addedTaskIds.has(task.id)),
      ];
    });
};

export const addRemoveTaskFromProjectExtraReducers = (
  builder: ActionReducerMapBuilder<ProjectsState>,
) => {
  builder
    .addCase(removeTaskFromProjectAction.pending, (state) => {
      state.error = null;
    })
    .addCase(removeTaskFromProjectAction.rejected, (state, action) => {
      state.error =
        action.payload?.message || "Failed to remove task from project";
    })
    .addCase(removeTaskFromProjectAction.fulfilled, (state, action) => {
      const { task, projectId } = action.payload;
      const project = state.projects.byId[projectId];

      state.error = null;

      if (!project) return;

      project.tasks = project.tasks.filter(
        (projectTask) => projectTask.id !== task.id,
      );
    });
};

export const addCreateProjectTaskExtraReducers = (
  builder: ActionReducerMapBuilder<ProjectsState>,
) => {
  builder.addCase(createTaskAction.fulfilled, (state, action) => {
    const { task, order_key } = action.payload;

    if (!task.project_id || order_key === null) return;

    const project = state.projects.byId[task.project_id];

    if (!project) return;

    project.tasks.push({
      id: task.id,
      order_key,
    });
  });
};

export const addDeleteProjectTaskExtraReducers = (
  builder: ActionReducerMapBuilder<ProjectsState>,
) => {
  builder
    .addCase(deleteTaskAction.pending, (state) => {
      state.error = null;
    })
    .addCase(deleteTaskAction.rejected, (state, action) => {
      state.error = action.payload?.message || "Failed to delete task";
    })
    .addCase(deleteTaskAction.fulfilled, (state, action) => {
      const { task } = action.payload;

      state.error = null;

      if (!task.project_id) return;

      const project = state.projects.byId[task.project_id];

      if (!project) return;

      project.tasks = project.tasks.filter(
        (projectTask) => projectTask.id !== task.id,
      );
    });
};

export const addUpdateProjectTaskExtraReducers = (
  builder: ActionReducerMapBuilder<ProjectsState>,
) => {
  builder
    .addCase(updateTaskAction.pending, (state) => {
      state.error = null;
    })
    .addCase(updateTaskAction.rejected, (state, action) => {
      state.error = action.payload?.message || "Failed to update task";
    })
    .addCase(updateTaskAction.fulfilled, (state, action) => {
      const { task, previousProjectId, projectOrderKey } = action.payload;

      const nextProjectId = task.project_id;

      state.error = null;

      if (previousProjectId && previousProjectId !== nextProjectId) {
        const previousProject = state.projects.byId[previousProjectId];

        if (previousProject) {
          previousProject.tasks = previousProject.tasks.filter(
            (projectTask) => projectTask.id !== task.id,
          );
        }
      }

      if (!nextProjectId) {
        return;
      }

      const nextProject = state.projects.byId[nextProjectId];

      if (!nextProject) {
        return;
      }

      if (projectOrderKey === null) {
        state.error = "Failed to get updated task project order";
        return;
      }

      const existingTaskIndex = nextProject.tasks.findIndex(
        (projectTask) => projectTask.id === task.id,
      );

      const projectTask = {
        id: task.id,
        order_key: projectOrderKey,
      };

      if (existingTaskIndex === -1) {
        nextProject.tasks.push(projectTask);
      } else {
        nextProject.tasks[existingTaskIndex] = projectTask;
      }

      nextProject.tasks.sort(
        (firstTask, secondTask) => firstTask.order_key - secondTask.order_key,
      );
    });
};
