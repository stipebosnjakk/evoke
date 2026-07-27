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
  RepeatTodayStatus,
  TaskStateData,
  TaskStatus,
} from "@/types/task.types";

// TODO: for some reason all of my tasks has order key around 5000

export const createTaskRepo = async (task: FormTask): Promise<CreatedTask> => {
  try {
    return await db.transaction(async (tx) => {
      if (!task.title) {
        throwDbError(null, "Title is required");
      }

      const taskStatus: TaskStatus | null = !task.status
        ? task.start_date || task.deadline
          ? "next"
          : null
        : task.status;

      const normalizedTask = {
        ...task,
        status: taskStatus,
      };

      const id = createId();
      const isInbox = isInboxTask(normalizedTask);
      let newOrderKey: number | null = null;

      if (isInbox) {
        const last = await tx
          .select()
          .from(list_order)
          .where(eq(list_order.scope_id, INBOX_SCOPE_ID))
          .orderBy(desc(list_order.order_key))
          .limit(1);

        const maxOrderKey = last[0]?.order_key ?? 0;
        newOrderKey = maxOrderKey + 1000 || 1000;

        await tx.insert(list_order).values({
          scope_id: INBOX_SCOPE_ID,
          item_id: id,
          order_key: newOrderKey,
        });
      }

      if (task.project_id) {
        const last = await tx
          .select()
          .from(list_order)
          .where(eq(list_order.scope_id, task.project_id))
          .orderBy(desc(list_order.order_key))
          .limit(1);

        const maxOrderKey = last[0]?.order_key ?? 0;
        newOrderKey = maxOrderKey + 1000 || 1000;

        await tx.insert(list_order).values({
          scope_id: task.project_id,
          item_id: id,
          order_key: newOrderKey,
        });
      }

      await tx.insert(tasks).values({
        ...normalizedTask,
        id,
      });

      const [createdRow] = await tx
        .select({
          task: tasks,
          project: {
            id: projects.id,
            name: projects.name,
            color: projects.color,
          },
        })
        .from(tasks)
        .leftJoin(projects, eq(tasks.project_id, projects.id))
        .where(eq(tasks.id, id))
        .limit(1);

      if (!createdRow) {
        throw new Error("Failed to create task");
      }

      const isRepeating = Boolean(createdRow.task.repeat?.length);

      const repeatTodayStatus: RepeatTodayStatus = isRepeating
        ? "not_completed_today"
        : null;

      const createdTask: TaskStateData = {
        ...createdRow.task,
        project: createdRow.project,
        repeat_today_status: repeatTodayStatus,
      };

      return {
        task: createdTask,
        order_key: newOrderKey,
      };
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

export const updateTaskRepo = async (
  taskId: string,
  task: FormTask,
): Promise<UpdateTaskReturnType> => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    return await db.transaction(async (tx) => {
      const [existingTask] = await tx
        .select()
        .from(tasks)
        .where(eq(tasks.id, taskId))
        .limit(1);

      if (!existingTask) {
        throw new Error(`Task "${taskId}" does not exist`);
      }

      const previousProjectId = existingTask.project_id;

      const normalizedRepeat = task.repeat?.length
        ? [...new Set(task.repeat)].sort((a, b) => a - b)
        : null;

      let normalizedStatus = task.status ?? null;

      if (normalizedRepeat) {
        normalizedStatus = "next";
      }

      if (!normalizedStatus && (task.start_date || task.deadline)) {
        normalizedStatus = "next";
      }

      if (!task.title?.trim()) {
        throw new Error("Task title is required");
      }

      const normalizedTask: FormTask = {
        title: task.title.trim(),
        description: task.description?.trim() || null,
        status: normalizedStatus,
        project_id: task.project_id ?? null,
        start_date: task.start_date ?? null,
        start_time_min: task.start_date ? (task.start_time_min ?? null) : null,
        duration_min: task.start_date ? (task.duration_min ?? null) : null,
        deadline: task.deadline ?? null,
        repeat: normalizedStatus === "next" ? normalizedRepeat : null,
      };

      if (
        normalizedTask.start_date &&
        normalizedTask.deadline &&
        normalizedTask.start_date > normalizedTask.deadline
      ) {
        throw new Error("Start date cannot be after deadline");
      }

      if (
        normalizedTask.duration_min !== null &&
        normalizedTask.duration_min !== undefined &&
        normalizedTask.start_time_min === null
      ) {
        throw new Error("Duration cannot be set without a start time");
      }

      if (normalizedTask.project_id) {
        const [project] = await tx
          .select({ id: projects.id })
          .from(projects)
          .where(eq(projects.id, normalizedTask.project_id))
          .limit(1);

        if (!project) {
          throw new Error(
            `Project "${normalizedTask.project_id}" does not exist`,
          );
        }
      }

      const now = getUnixTime(new Date());

      const [updatedTask] = await tx
        .update(tasks)
        .set({
          ...normalizedTask,
          updated_at: now,
        })
        .where(eq(tasks.id, taskId))
        .returning();

      if (!updatedTask) {
        throw new Error(`Failed to update task "${taskId}"`);
      }

      const getOrCreateOrderKey = async (scopeId: string): Promise<number> => {
        const [existingOrder] = await tx
          .select({
            order_key: list_order.order_key,
          })
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
          .select({
            order_key: list_order.order_key,
          })
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

      let inboxOrderKey: number | null = null;

      if (isInboxTask(updatedTask)) {
        inboxOrderKey = await getOrCreateOrderKey(INBOX_SCOPE_ID);
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

      let projectOrderKey: number | null = null;

      if (updatedTask.project_id) {
        projectOrderKey = await getOrCreateOrderKey(updatedTask.project_id);
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

      const FormTaskInfo: TaskStateData = {
        ...row.task,
        project: row.project,
        repeat_today_status: isRepeating
          ? row.completion
            ? "completed_today"
            : "not_completed_today"
          : null,
      };

      return {
        task: FormTaskInfo,
        previousProjectId,
        inboxOrderKey,
        projectOrderKey,
      };
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
      const [existingTask] = await tx
        .select()
        .from(tasks)
        .where(eq(tasks.id, taskId))
        .limit(1);

      if (!existingTask) {
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
