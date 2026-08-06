import { eq, desc, and } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { getUnixTime } from "date-fns";

import { INBOX_SCOPE_ID } from "@/constants/scopeIds";
import { db } from "@/db/client";
import { throwDbError } from "@/utils/error";
import { isInboxTask } from "@/utils/taskPlacement";
import { toIsoDate } from "@/utils/date";
import {
  FormTask,
  list_order,
  projects,
  Task,
  task_completions,
  tasks,
} from "@/db/schemas";
import {
  CreatedTask,
  IsoDate,
  RepeatTodayStatus,
  TaskProject,
  TaskStateData,
  TaskStatus,
  Weekday,
} from "@/types/task.types";
import { STATUS_OPTIONS } from "@/constants/status";
import {
  validateTask,
  validateTaskDeadline,
  validateTaskDuration,
  validateTaskRepeat,
  validateTaskStartDate,
  validateTaskTime,
} from "@/utils/validate";
import { findTaskById, handleGetOrCreateOrderKey } from "./helper.task.repo";

// TODO: for some reason all of my tasks has order key around 5000

export const createTaskRepo = async (
  formTask: FormTask,
): Promise<CreatedTask> => {
  const validation = validateTask(formTask);

  if (!validation.ok) {
    throw new Error(validation.message);
  }

  const validatedTask = validation.data;

  try {
    return await db.transaction(async (tx) => {
      const taskId = createId();

      const [createdTask] = await tx
        .insert(tasks)
        .values({
          ...validatedTask,
          id: taskId,
        })
        .returning();

      if (!createdTask) {
        throw new Error("Failed to create task");
      }

      const { inboxOrderKey, projectOrderKey } =
        await handleGetOrCreateOrderKey({
          tx,
          task: createdTask,
        });

      let project: TaskProject | null = null;

      if (createdTask.project_id !== null) {
        const [projectRow] = await tx
          .select({
            id: projects.id,
            name: projects.name,
            color: projects.color,
          })
          .from(projects)
          .where(eq(projects.id, createdTask.project_id))
          .limit(1);

        if (!projectRow) {
          throw new Error("Task project was not found");
        }

        project = projectRow;
      }

      const repeatTodayStatus: RepeatTodayStatus = Boolean(
        createdTask.repeat?.length,
      )
        ? "not_completed_today"
        : null;

      const newTask: TaskStateData = {
        ...createdTask,
        project,
        repeat_today_status: repeatTodayStatus,
      };

      const result: CreatedTask = {
        task: newTask,
        inboxOrderKey,
        projectOrderKey,
      };

      return result;
    });
  } catch (error: unknown) {
    return throwDbError(error, "Failed to create task");
  }
};

export type UpdateTaskReturnType = {
  task: TaskStateData;
  previousProjectId: string | null;
  inboxOrderKey: number | null;
  projectOrderKey: number | null;
};

export type UpdateTaskType = {
  taskId: string;
  formTask: FormTask;
};

export const updateTaskRepo = async ({
  taskId,
  formTask,
}: UpdateTaskType): Promise<UpdateTaskReturnType> => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    return await db.transaction(async (tx) => {
      const prevTask = await findTaskById({ taskId, tx });

      if (!prevTask) {
        throw new Error(`Task "${taskId}" does not exist`);
      }

      const validation = validateTask(formTask);

      if (!validation.ok) {
        throw new Error(validation.message);
      }

      const previousProjectId = prevTask.project_id;
      const task = validation.data;

      const [updatedTask] = await tx
        .update(tasks)
        .set({
          ...task,
          updated_at: getUnixTime(new Date()),
        })
        .where(eq(tasks.id, taskId))
        .returning();

      if (!updatedTask) {
        throw new Error(`Task "${taskId}" does not exist`);
      }

      if (previousProjectId && previousProjectId !== updatedTask.project_id) {
        await tx
          .delete(list_order)
          .where(
            and(
              eq(list_order.scope_id, previousProjectId),
              eq(list_order.item_id, taskId),
            ),
          );
      }

      let project: TaskProject | null = null;

      if (updatedTask.project_id !== null) {
        const [projectRow] = await tx
          .select({
            id: projects.id,
            name: projects.name,
            color: projects.color,
          })
          .from(projects)
          .where(eq(projects.id, updatedTask.project_id))
          .limit(1);

        if (!projectRow) {
          throw new Error("Task project was not found");
        }

        project = projectRow;
      }

      let repeat_today_status: RepeatTodayStatus = null;

      if (Boolean(updatedTask.repeat?.length)) {
        const today = toIsoDate(new Date());

        const [isCompletedToday] = await tx
          .select({
            completion_date: task_completions.completion_date,
          })
          .from(task_completions)
          .where(
            and(
              eq(task_completions.task_id, updatedTask.id),
              eq(task_completions.completion_date, today),
            ),
          )
          .limit(1);

        if (isCompletedToday) {
          repeat_today_status = "completed_today";
        } else {
          repeat_today_status = "not_completed_today";
        }
      }

      const { inboxOrderKey, projectOrderKey } =
        await handleGetOrCreateOrderKey({
          tx,
          task: updatedTask,
        });

      const resultDataTask: TaskStateData = {
        ...updatedTask,
        project,
        repeat_today_status,
      };

      const result: UpdateTaskReturnType = {
        task: resultDataTask,
        inboxOrderKey,
        projectOrderKey,
        previousProjectId,
      };

      return result;
    });
  } catch (error) {
    return throwDbError(error, "Failed to update task");
  }
};

export type DeleteTaskReturnType = {
  task: Task;
};

export const deleteTaskRepo = async (
  taskId: string,
): Promise<DeleteTaskReturnType> => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    return await db.transaction(async (tx) => {
      const task = await findTaskById({ taskId, tx });

      if (!task) {
        throw new Error(`Task "${taskId}" does not exist`);
      }

      await tx.delete(list_order).where(eq(list_order.item_id, taskId));

      await tx
        .delete(task_completions)
        .where(eq(task_completions.task_id, taskId));

      const [deletedTask] = await tx
        .delete(tasks)
        .where(eq(tasks.id, taskId))
        .returning();

      if (!deletedTask) {
        throw new Error(`Failed to delete task "${taskId}"`);
      }

      return { task: deletedTask };
    });
  } catch (error) {
    return throwDbError(error, "Failed to delete task");
  }
};

export type UpdateTaskInputsInput = {
  taskId: string;
  title: string | null;
  description: string | null;
};

export type UpdateTaskInputsReturnType = {
  task: Task;
};

export const updateTaskInputsRepo = async ({
  taskId,
  title,
  description,
}: UpdateTaskInputsInput): Promise<UpdateTaskInputsReturnType> => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    if (!title?.trim()) {
      throw new Error("Title is required");
    }

    if (title.length > 255) {
      throw new Error("Title must be 255 characters or less");
    }

    if (description && description.length > 2000) {
      throw new Error("Description must be 2000 characters or less");
    }

    const [updatedTask] = await db
      .update(tasks)
      .set({
        title: title,
        description: description,
        updated_at: getUnixTime(new Date()),
      })
      .where(eq(tasks.id, taskId))
      .returning();

    if (!updatedTask) {
      throw new Error(`Task "${taskId}" does not exist`);
    }

    return {
      task: updatedTask,
    };
  } catch (error) {
    return throwDbError(error, "Failed to update task inputs");
  }
};

export type UpdateTaskStatusInput = {
  taskId: string;
  status: TaskStatus | null;
};

export type UpdateTaskStatusReturnType = {
  task: Task;
};

export const updateTaskStatusRepo = async ({
  taskId,
  status,
}: UpdateTaskStatusInput): Promise<UpdateTaskStatusReturnType> => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const isValidStatus =
      status === null ||
      STATUS_OPTIONS.some((option) => option.value === status);

    if (!isValidStatus) {
      throw new Error("Task status is not valid");
    }

    return await db.transaction(async (tx) => {
      const task = await findTaskById({ taskId, tx });

      if (!task) {
        throw new Error(`Task "${taskId}" does not exist`);
      }

      if (task.repeat?.length && status !== "next") {
        throw new Error("A repeating task must have the Next status");
      }

      const [updatedTask] = await tx
        .update(tasks)
        .set({
          status,
          updated_at: getUnixTime(new Date()),
        })
        .where(eq(tasks.id, taskId))
        .returning();

      if (!updatedTask) {
        throw new Error(`Failed to update task "${taskId}"`);
      }

      return {
        task: updatedTask,
      };
    });
  } catch (error) {
    return throwDbError(error, "Failed to update task status");
  }
};

export type UpdateTaskProjectType = {
  taskId: string | null;
  projectId: string | null;
};

export type UpdateTaskProjectReturnType = {
  task: TaskStateData;
};

export const updateTaskProjectRepo = async ({
  taskId,
  projectId,
}: UpdateTaskProjectType): Promise<UpdateTaskProjectReturnType> => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    return await db.transaction(async (tx) => {
      const task = await findTaskById({ taskId, tx });

      if (!task) {
        throw new Error(`Task "${taskId}" does not exist`);
      }

      if (projectId) {
        const [project] = await tx
          .select({ id: projects.id })
          .from(projects)
          .where(eq(projects.id, projectId))
          .limit(1);

        if (!project) {
          throw new Error(`Project "${projectId}" does not exist`);
        }
      }

      const previousProjectId = task.project_id;
      const now = getUnixTime(new Date());

      const [updatedTask] = await tx
        .update(tasks)
        .set({
          project_id: projectId,
          updated_at: now,
        })
        .where(eq(tasks.id, taskId))
        .returning();

      if (!updatedTask) {
        throw new Error(`Failed to update task "${taskId}" project`);
      }

      const getOrCreateOrderKey = async (scopeId: string): Promise<number> => {
        const [existingOrder] = await tx
          .select({ order_key: list_order.order_key })
          .from(list_order)
          .where(
            and(
              eq(list_order.scope_id, scopeId),
              eq(list_order.item_id, taskId),
            ),
          )
          .limit(1);

        if (existingOrder) {
          return existingOrder.order_key;
        }

        const [lastItem] = await tx
          .select({ order_key: list_order.order_key })
          .from(list_order)
          .where(eq(list_order.scope_id, scopeId))
          .orderBy(desc(list_order.order_key))
          .limit(1);

        const orderKey = (lastItem?.order_key ?? 0) + 1000;

        await tx.insert(list_order).values({
          scope_id: scopeId,
          item_id: taskId,
          order_key: orderKey,
          updated_at: now,
        });

        return orderKey;
      };

      if (isInboxTask(updatedTask)) {
        await getOrCreateOrderKey(INBOX_SCOPE_ID);
      } else {
        await tx
          .delete(list_order)
          .where(
            and(
              eq(list_order.scope_id, INBOX_SCOPE_ID),
              eq(list_order.item_id, taskId),
            ),
          );
      }

      if (previousProjectId && previousProjectId !== projectId) {
        await tx
          .delete(list_order)
          .where(
            and(
              eq(list_order.scope_id, previousProjectId),
              eq(list_order.item_id, taskId),
            ),
          );
      }

      if (projectId) {
        await getOrCreateOrderKey(projectId);
      }

      const today = toIsoDate(new Date());

      const [row] = await tx
        .select({
          task: tasks,
          project: {
            id: projects.id,
            name: projects.name,
            color: projects.color,
          },
          completion: {
            id: task_completions.id,
          },
        })
        .from(tasks)
        .leftJoin(projects, eq(tasks.project_id, projects.id))
        .leftJoin(
          task_completions,
          and(
            eq(task_completions.task_id, tasks.id),
            eq(task_completions.completion_date, today),
          ),
        )
        .where(eq(tasks.id, taskId))
        .limit(1);

      if (!row) {
        throw new Error(`Failed to fetch updated task "${taskId}"`);
      }

      const isRepeating = Boolean(row.task.repeat?.length);

      return {
        task: {
          ...row.task,
          project: row.project,
          repeat_today_status: isRepeating
            ? row.completion
              ? "completed_today"
              : "not_completed_today"
            : null,
        },
      };
    });
  } catch (error) {
    return throwDbError(error, "Failed to update task's project");
  }
};

type TimeAndDate = {
  start_date: IsoDate | null;
  start_time_min: number | null;
};

export type UpdateTaskStartDateArgsType = TimeAndDate & {
  taskId: string | null;
};

export type UpdateTaskStartDateType = TimeAndDate & {
  updated_at: number;
};

export type TaskStartDateReturnType = UpdateTaskStartDateType &
  UpdateTaskStartDateArgsType;

export const updateTaskStartDateRepo = async ({
  taskId,
  start_date,
  start_time_min,
}: UpdateTaskStartDateArgsType): Promise<TaskStartDateReturnType> => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    return await db.transaction(
      async (tx): Promise<TaskStartDateReturnType> => {
        const task = await findTaskById({ taskId, tx });

        if (!task) {
          throw new Error(`Task "${taskId}" does not exist`);
        }

        const validateStartDate = validateTaskStartDate({
          deadline: task.deadline,
          start_date,
        });

        if (!validateStartDate.ok) {
          throw new Error(validateStartDate.message);
        }

        const date = validateStartDate.data;

        let time: number | null = null;
        const hasStartDate = Boolean(date);
        const hasRepeat = Boolean(task.repeat?.length);

        if ((hasStartDate || hasRepeat) && start_time_min) {
          const validateTime = validateTaskTime({
            start_time_min,
            start_date: date,
            repeat: task.repeat,
          });

          if (!validateTime.ok) {
            throw new Error(validateTime.message);
          }

          time = validateTime.data;
        }

        const now = getUnixTime(new Date());

        let updateData: UpdateTaskStartDateType;

        if (!hasStartDate) {
          updateData = {
            start_date: null,
            start_time_min: hasRepeat ? time : null,
            updated_at: now,
          };
        } else {
          updateData = {
            start_date: date,
            start_time_min: time,
            updated_at: now,
          };
        }

        await tx.update(tasks).set(updateData).where(eq(tasks.id, taskId));

        return {
          taskId,
          ...updateData,
        };
      },
    );
  } catch (error) {
    return throwDbError(error, "Failed to update start date");
  }
};

export type UpdateTaskDeadlineArgsType = {
  taskId: string | null;
  deadline: IsoDate | null;
};

export type UpdateTaskDeadlineReturnType = {
  deadline: IsoDate | null;
  updated_at: number;
  taskId: string;
};

export const updateTaskDeadlineRepo = async ({
  deadline,
  taskId,
}: UpdateTaskDeadlineArgsType): Promise<UpdateTaskDeadlineReturnType> => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    return await db.transaction(async (tx) => {
      const task = await findTaskById({ taskId, tx });

      if (!task) {
        throw new Error(`Task "${taskId}" does not exist`);
      }

      const validation = validateTaskDeadline({
        deadline,
        startDate: task.start_date,
      });

      if (!validation.ok) {
        throw new Error(validation.message);
      }

      const now = getUnixTime(new Date());

      const update = { deadline: validation.data, updated_at: now };

      await tx.update(tasks).set(update).where(eq(tasks.id, taskId));

      return {
        taskId,
        ...update,
      };
    });
  } catch (error) {
    return throwDbError(error, "Failed to update deadline");
  }
};

type RepeatAndTime = {
  repeat: Weekday[] | null;
  start_time_min: number | null;
};

export type UpdateTaskRepeatDays = RepeatAndTime & {
  taskId: string | null;
};

export type UpdateTaskRepeatDaysReturnType = UpdateTaskRepeatDays & {
  updated_at: number;
};

export const updateTaskRepeatDaysRepo = async ({
  taskId,
  repeat,
  start_time_min,
}: UpdateTaskRepeatDays): Promise<UpdateTaskRepeatDaysReturnType> => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    return await db.transaction(async (tx) => {
      const task = await findTaskById({ taskId, tx });

      if (!task) {
        throw new Error(`Task "${taskId}" does not exist`);
      }

      const validateRepeat = validateTaskRepeat({
        repeatDays: repeat,
        status: task.status,
      });

      if (!validateRepeat.ok) {
        throw new Error(validateRepeat.message);
      }

      const data = validateRepeat.data;

      let time: number | null = null;
      const hasRepeat = Boolean(data?.length);
      const hasStartDate = Boolean(task.start_date);

      if ((hasRepeat || hasStartDate) && start_time_min) {
        const validateTime = validateTaskTime({
          start_time_min,
          repeat,
          start_date: task.start_date,
        });

        if (!validateTime.ok) {
          throw new Error(validateTime.message);
        }

        time = validateTime.data;
      }

      const now = getUnixTime(new Date());

      const update = {
        repeat: data,
        start_time_min: !hasRepeat && !hasStartDate ? null : time,
        updated_at: now,
      };

      await tx.update(tasks).set(update).where(eq(tasks.id, taskId));

      return {
        ...update,
        taskId,
      };
    });
  } catch (error) {
    return throwDbError(error, "Failed to update repeat days");
  }
};

export type UpdateTaskTimeArgs = {
  taskId: string | null;
  start_time_min: number | null;
};

export type UpdateTaskTimeReturnType = UpdateTaskTimeArgs & {
  updated_at: number;
};

export const updateTaskTimeRepo = async ({
  taskId,
  start_time_min,
}: UpdateTaskTimeArgs): Promise<UpdateTaskTimeReturnType> => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    return await db.transaction(async (tx) => {
      const task = await findTaskById({ taskId, tx });

      if (!task) {
        throw new Error(`Task "${taskId}" does not exist`);
      }

      let time: number | null = null;

      if (start_time_min) {
        const validation = validateTaskTime({
          start_time_min,
          repeat: task.repeat,
          start_date: task.start_date,
        });

        if (!validation.ok) {
          throw new Error(validation.message);
        }

        time = validation.data;
      }

      const now = getUnixTime(new Date());

      const update = {
        start_time_min: time,
        updated_at: now,
      };

      await tx.update(tasks).set(update).where(eq(tasks.id, taskId));

      return {
        ...update,
        taskId,
      };
    });
  } catch (error) {
    return throwDbError(error, "Failed to update time");
  }
};

export type UpdateTaskDurationArgs = {
  taskId: string;
  duration_min: number | null;
};

export type UpdateTaskDurationReturnType = {
  taskId: string;
  duration_min: number | null;
  updated_at: number;
};

export const updateTaskDurationRepo = async ({
  taskId,
  duration_min,
}: UpdateTaskDurationArgs): Promise<UpdateTaskDurationReturnType> => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    return await db.transaction(async (tx) => {
      const task = await findTaskById({ taskId, tx });

      if (!task) {
        throw new Error(`Task "${taskId}" does not exist`);
      }

      const validation = validateTaskDuration({ duration_min });

      if (!validation.ok) {
        throw new Error(validation.message);
      }

      const now = getUnixTime(new Date());

      const update = {
        duration_min: validation.data,
        updated_at: now,
      };

      await tx.update(tasks).set(update).where(eq(tasks.id, taskId));

      return {
        ...update,
        taskId,
      };
    });
  } catch (error) {
    return throwDbError(error, "Failed to update duration");
  }
};
