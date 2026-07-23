import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { ProjectsState, TasksState } from "@/types/initialState.types";
import {
  addTasksToProjectAction,
  completeProjectAction,
  completeTaskAction,
  deleteProjectAction,
  restoreCompletedRepeatTaskAction,
  restoreCompletedTaskAction,
  updateOrderKeysAction,
  updateProjectAction,
} from "@/store/thunks/mutation.thunks";
import { INBOX_SCOPE_ID } from "@/constants/scopeIds";

export const addInboxReorderExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(updateOrderKeysAction.pending, (state, action) => {
      const { orderArray, scopeId } = action.meta.arg;
      if (scopeId !== INBOX_SCOPE_ID) return;
      state.error = null;
      for (const item of orderArray) {
        state.taskOrder.inbox[item.id] = item.order_key;
      }
    })
    .addCase(updateOrderKeysAction.rejected, (state, action) => {
      if (action.meta.arg.scopeId !== INBOX_SCOPE_ID) return;
      state.error = action.payload?.message || "Failed to update order keys";
    })
    .addCase(updateOrderKeysAction.fulfilled, (state, action) => {
      if (action.payload.scopeId !== INBOX_SCOPE_ID) return;
      state.error = null;
    });
};

export const addTaskCompletionExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(completeTaskAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to complete task";
    })
    .addCase(completeTaskAction.fulfilled, (state, action) => {
      const task = action.payload.task;

      state.status = "succeeded";
      state.error = null;
      state.tasks.byId[task.id] = task;

      if (!state.tasks.ids.includes(task.id)) {
        state.tasks.ids.push(task.id);
      }
    })
    .addCase(restoreCompletedTaskAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to restore task";
    })
    .addCase(restoreCompletedTaskAction.fulfilled, (state, action) => {
      const task = action.payload.task;

      state.status = "succeeded";
      state.error = null;
      state.tasks.byId[task.id] = task;

      if (!state.tasks.ids.includes(task.id)) {
        state.tasks.ids.push(task.id);
      }
    })
    .addCase(restoreCompletedRepeatTaskAction.rejected, (state, action) => {
      state.status = "failed";
      state.error =
        action.payload?.message || "Failed to restore repeating task";
    })
    .addCase(restoreCompletedRepeatTaskAction.fulfilled, (state, action) => {
      const { taskId } = action.payload;
      const task = state.tasks.byId[taskId];

      state.status = "succeeded";
      state.error = null;

      if (!task) return;

      task.repeat_today_status = "not_completed_today";
    });
};

export const addProjectTaskReorderExtraReducers = (
  builder: ActionReducerMapBuilder<ProjectsState>,
) => {
  builder
    .addCase(updateOrderKeysAction.pending, (state, action) => {
      const { orderArray, scopeId } = action.meta.arg;
      const project = state.projects.byId[scopeId];

      if (!project) return;

      state.error = null;

      const orderByTaskId = new Map(
        orderArray.map((item) => [item.id, item.order_key]),
      );

      for (const task of project.tasks) {
        const orderKey = orderByTaskId.get(task.id);
        if (orderKey !== undefined) {
          task.order_key = orderKey;
        }
      }
    })
    .addCase(updateOrderKeysAction.rejected, (state, action) => {
      const project = state.projects.byId[action.meta.arg.scopeId];

      if (!project) return;

      state.error = action.payload?.message || "Failed to update order keys";
    })
    .addCase(updateOrderKeysAction.fulfilled, (state, action) => {
      const project = state.projects.byId[action.payload.scopeId];

      if (!project) return;

      state.error = null;
    });
};

export const addTasksToProjectTaskExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(addTasksToProjectAction.pending, (state) => {
      state.error = null;
    })
    .addCase(addTasksToProjectAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to add tasks to project";
    })
    .addCase(addTasksToProjectAction.fulfilled, (state, action) => {
      const { projectTasks, project } = action.payload;

      state.status = "succeeded";
      state.error = null;

      for (const projectTask of projectTasks) {
        const task = state.tasks.byId[projectTask.id];

        if (!task) continue;

        task.project_id = project.id;
        task.project = project;
      }
    });
};

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

export const addUpdateProjectExtraReducers = (
  builder: ActionReducerMapBuilder<ProjectsState>,
) => {
  builder
    .addCase(updateProjectAction.pending, (state) => {
      state.error = null;
    })
    .addCase(updateProjectAction.rejected, (state, action) => {
      state.error = action.payload?.message || "Failed to update project";
    })
    .addCase(updateProjectAction.fulfilled, (state, action) => {
      const { project } = action.payload;
      const existingProject = state.projects.byId[project.id];

      if (!existingProject) {
        state.error = "Failed to get project data";
        return;
      }

      state.error = null;

      state.projects.byId[project.id] = {
        ...existingProject,
        ...project,
      };
    });
};

export const addCompleteProjectExtraReducers = (
  builder: ActionReducerMapBuilder<ProjectsState>,
) => {
  builder
    .addCase(completeProjectAction.pending, (state) => {
      state.error = null;
    })
    .addCase(completeProjectAction.rejected, (state, action) => {
      state.error = action.payload?.message || "Failed to complete project";
    })
    .addCase(completeProjectAction.fulfilled, (state, action) => {
      const { project } = action.payload;
      const existingProject = state.projects.byId[project.id];

      if (!existingProject) {
        state.error = "Failed to get project data";
        return;
      }

      state.error = null;
      state.projects.byId[project.id] = {
        ...existingProject,
        ...project,
      };
    });
};

export const addCompleteProjectTasksExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(completeProjectAction.pending, (state) => {
      state.error = null;
    })
    .addCase(completeProjectAction.rejected, (state, action) => {
      state.error =
        action.payload?.message || "Failed to complete project tasks";
    })
    .addCase(completeProjectAction.fulfilled, (state, action) => {
      const { tasks } = action.payload;
      state.error = null;

      for (const task of tasks) {
        const oldTask = state.tasks.byId[task.id];

        state.tasks.byId[task.id] = {
          ...oldTask,
          ...task,
        };

        if (!state.tasks.ids.includes(task.id)) {
          state.tasks.ids.push(task.id);
        }
      }
    });
};

export const addDeleteProjectExtraReducers = (
  builder: ActionReducerMapBuilder<ProjectsState>,
) => {
  builder
    .addCase(deleteProjectAction.pending, (state) => {
      state.error = null;
    })
    .addCase(deleteProjectAction.rejected, (state, action) => {
      state.error = action.payload?.message || "Failed to delete project";
    })
    .addCase(deleteProjectAction.fulfilled, (state, action) => {
      const { project } = action.payload;

      state.error = null;

      delete state.projects.byId[project.id];

      state.projects.ids = state.projects.ids.filter(
        (projectId) => projectId !== project.id,
      );
    });
};

export const addDeleteProjectTasksExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(deleteProjectAction.pending, (state) => {
      state.error = null;
    })
    .addCase(deleteProjectAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to delete project tasks";
    })
    .addCase(deleteProjectAction.fulfilled, (state, action) => {
      const { tasks: deletedTasks } = action.payload;
      const deletedTaskIds = new Set(deletedTasks.map((task) => task.id));

      state.status = "succeeded";
      state.error = null;

      for (const taskId of deletedTaskIds) {
        delete state.tasks.byId[taskId];
        delete state.taskOrder.inbox[taskId];
      }

      state.tasks.ids = state.tasks.ids.filter(
        (taskId) => !deletedTaskIds.has(taskId),
      );
    });
};
