import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { TasksState } from "@/types/initialState.types";
import {
  createTaskAction,
  deleteTaskAction,
  seedDefaultTasksAction,
  updateTaskAction,
  updateTaskDeadlineAction,
  updateTaskDurationAction,
  updateTaskInputsAction,
  updateTaskProjectAction,
  updateTaskRepeatDaysAction,
  updateTaskStartDateAction,
  updateTaskStatusAction,
  updateTaskTimeAction,
} from "@/store/thunks/task/task.crud.thunks";

export const addCreateTaskExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(createTaskAction.pending, (state, _) => {
      state.error = null;
    })
    .addCase(createTaskAction.rejected, (state, action) => {
      state.error = action.payload?.message ?? "Failed to create task";
    })
    .addCase(createTaskAction.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.error = null;

      const { task, inboxOrderKey } = action.payload;

      if (!task) {
        state.error = "Failed to create task";
        return;
      }

      if (!state.tasks.ids.includes(task.id)) {
        state.tasks.ids.unshift(task.id);
      }

      if (inboxOrderKey !== null) {
        state.taskOrder.inbox[task.id] = inboxOrderKey;
      }

      state.tasks.byId[task.id] = task;
    });
};

export const addUpdateTaskExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(updateTaskAction.pending, (state) => {
      state.error = null;
    })
    .addCase(updateTaskAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to update task";
    })
    .addCase(updateTaskAction.fulfilled, (state, action) => {
      const { task, inboxOrderKey } = action.payload;

      state.status = "succeeded";
      state.error = null;

      state.tasks.byId[task.id] = task;

      if (!state.tasks.ids.includes(task.id)) {
        state.tasks.ids.push(task.id);
      }

      if (inboxOrderKey === null) {
        delete state.taskOrder.inbox[task.id];
      } else {
        state.taskOrder.inbox[task.id] = inboxOrderKey;
      }
    });
};

export const addDeleteTaskExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(deleteTaskAction.pending, (state) => {
      state.error = null;
    })
    .addCase(deleteTaskAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to delete task";
    })
    .addCase(deleteTaskAction.fulfilled, (state, action) => {
      const { task } = action.payload;

      state.status = "succeeded";
      state.error = null;

      delete state.tasks.byId[task.id];
      delete state.taskOrder.inbox[task.id];

      state.tasks.ids = state.tasks.ids.filter((taskId) => taskId !== task.id);
    });
};

export const addUpdateTaskInputsExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(updateTaskInputsAction.pending, (state) => {
      state.error = null;
    })
    .addCase(updateTaskInputsAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to update task inputs";
    })
    .addCase(updateTaskInputsAction.fulfilled, (state, action) => {
      const { task } = action.payload;
      const existingTask = state.tasks.byId[task.id];

      if (!existingTask) {
        state.status = "failed";
        state.error = `Task "${task.id}" is missing from state`;
        return;
      }

      state.status = "succeeded";
      state.error = null;

      state.tasks.byId[task.id] = {
        ...existingTask,
        ...task,
      };
    });
};

export const addUpdateTaskStatusExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(updateTaskStatusAction.pending, (state) => {
      state.error = null;
    })
    .addCase(updateTaskStatusAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to update task status";
    })
    .addCase(updateTaskStatusAction.fulfilled, (state, action) => {
      const { task } = action.payload;
      const existingTask = state.tasks.byId[task.id];

      if (!existingTask) {
        state.status = "failed";
        state.error = `Task "${task.id}" is missing from state`;
        return;
      }

      state.status = "succeeded";
      state.error = null;

      state.tasks.byId[task.id] = {
        ...existingTask,
        ...task,
      };
    });
};

export const addUpdateTaskProjectExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(updateTaskProjectAction.pending, (state) => {
      state.error = null;
    })
    .addCase(updateTaskProjectAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message || "Failed to update task project";
    })
    .addCase(updateTaskProjectAction.fulfilled, (state, action) => {
      const { task } = action.payload;

      state.status = "succeeded";
      state.error = null;

      state.tasks.byId[task.id] = task;

      if (!state.tasks.ids.includes(task.id)) {
        state.tasks.ids.push(task.id);
      }
    });
};

export const addUpdateTaskStartDateExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(updateTaskStartDateAction.pending, (state) => {
      state.error = null;
    })
    .addCase(updateTaskStartDateAction.rejected, (state, action) => {
      state.status = "failed";
      state.error =
        action.payload?.message ?? "Failed to update task start date";
    })
    .addCase(updateTaskStartDateAction.fulfilled, (state, action) => {
      const { taskId, start_date, start_time_min, updated_at } = action.payload;

      if (!taskId) {
        state.status = "failed";
        state.error = "Task ID is required";
        return;
      }

      const task = state.tasks.byId[taskId];

      if (!task) {
        state.status = "failed";
        state.error = `Task "${taskId}" is missing from state`;
        return;
      }

      task.start_date = start_date;
      task.start_time_min = start_time_min;
      task.updated_at = updated_at;

      state.status = "succeeded";
      state.error = null;
    });
};

export const addUpdateTaskDeadlineExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(updateTaskDeadlineAction.pending, (state) => {
      state.error = null;
    })
    .addCase(updateTaskDeadlineAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message ?? "Failed to update task deadline";
    })
    .addCase(updateTaskDeadlineAction.fulfilled, (state, action) => {
      const { taskId, deadline, updated_at } = action.payload;
      const task = state.tasks.byId[taskId];

      if (!task) {
        state.status = "failed";
        state.error = `Task "${taskId}" is missing from state`;
        return;
      }

      task.deadline = deadline;
      task.updated_at = updated_at;

      state.status = "succeeded";
      state.error = null;
    });
};

export const addUpdateTaskRepeatDaysExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(updateTaskRepeatDaysAction.pending, (state) => {
      state.error = null;
    })
    .addCase(updateTaskRepeatDaysAction.rejected, (state, action) => {
      state.status = "failed";
      state.error =
        action.payload?.message ?? "Failed to update task repeat days";
    })
    .addCase(updateTaskRepeatDaysAction.fulfilled, (state, action) => {
      const { taskId, repeat, start_time_min, updated_at } = action.payload;

      if (!taskId) {
        state.status = "failed";
        state.error = "Task ID is required";
        return;
      }

      const task = state.tasks.byId[taskId];

      if (!task) {
        state.status = "failed";
        state.error = `Task "${taskId}" is missing from state`;
        return;
      }

      task.repeat = repeat;
      task.start_time_min = start_time_min;
      task.updated_at = updated_at;

      state.status = "succeeded";
      state.error = null;
    });
};

export const addUpdateTaskTimeExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(updateTaskTimeAction.pending, (state) => {
      state.error = null;
    })
    .addCase(updateTaskTimeAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message ?? "Failed to update task time";
    })
    .addCase(updateTaskTimeAction.fulfilled, (state, action) => {
      const { taskId, start_time_min, updated_at } = action.payload;

      if (!taskId) {
        state.status = "failed";
        state.error = "Task ID is required";
        return;
      }

      const task = state.tasks.byId[taskId];

      if (!task) {
        state.status = "failed";
        state.error = `Task "${taskId}" is missing from state`;
        return;
      }

      task.start_time_min = start_time_min;
      task.updated_at = updated_at;

      state.status = "succeeded";
      state.error = null;
    });
};

export const addUpdateTaskDurationExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(updateTaskDurationAction.pending, (state) => {
      state.error = null;
    })
    .addCase(updateTaskDurationAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message ?? "Failed to update task duration";
    })
    .addCase(updateTaskDurationAction.fulfilled, (state, action) => {
      const { taskId, duration_min, updated_at } = action.payload;

      if (!taskId) {
        state.status = "failed";
        state.error = "Task ID is required";
        return;
      }

      const task = state.tasks.byId[taskId];

      if (!task) {
        state.status = "failed";
        state.error = `Task "${taskId}" is missing from state`;
        return;
      }

      task.duration_min = duration_min;
      task.updated_at = updated_at;

      state.status = "succeeded";
      state.error = null;
    });
};

export const addSeedDefaultTasksExtraReducers = (
  builder: ActionReducerMapBuilder<TasksState>,
) => {
  builder
    .addCase(seedDefaultTasksAction.pending, (state) => {
      state.status = "loading";
      state.error = null;
    })
    .addCase(seedDefaultTasksAction.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload?.message ?? "Failed to seed default tasks";
    })
    .addCase(seedDefaultTasksAction.fulfilled, (state, action) => {
      const tasks = action.payload;

      for (const task of tasks) {
        state.tasks.byId[task.id] = task;

        if (!state.tasks.ids.includes(task.id)) {
          state.tasks.ids.push(task.id);
        }
      }

      state.status = "succeeded";
      state.error = null;
    });
};
