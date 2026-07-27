import { eq, and } from "drizzle-orm";
import { getUnixTime } from "date-fns";
import { createId } from "@paralleldrive/cuid2";

import { db } from "@/db/client";
import { projects, task_completions, tasks } from "@/db/schemas";
import { IsoDate, TaskStateData } from "@/types/task.types";
import { throwDbError } from "@/utils/error";
import { toIsoDate } from "@/utils/date";

export const completeTaskRepo = async (
  taskId: string,
): Promise<TaskStateData> => {
  try {
    const now = getUnixTime(new Date());

    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const [updatedTask] = await db
      .update(tasks)
      .set({
        is_completed: true,
        completed_at_utc: now,
        updated_at: now,
      })
      .where(eq(tasks.id, taskId))
      .returning();

    if (!updatedTask) {
      throw new Error(`Failed to complete task "${taskId}""`);
    }

    const [row] = await db
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
      .where(eq(tasks.id, updatedTask.id))
      .limit(1);

    if (!row) {
      throw new Error(`Failed to fetch restored task "${taskId}"`);
    }

    const task: TaskStateData = {
      ...row.task,
      project: row.project,
      repeat_today_status: null,
    };

    return task;
  } catch (error) {
    return throwDbError(error, "Failed to complete task");
  }
};

export const restoreCompletedTaskRepo = async (
  taskId: string,
): Promise<TaskStateData> => {
  try {
    const now = getUnixTime(new Date());

    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const [updatedTask] = await db
      .update(tasks)
      .set({
        is_completed: false,
        completed_at_utc: null,
        updated_at: now,
      })
      .where(eq(tasks.id, taskId))
      .returning({ id: tasks.id });

    if (!updatedTask) {
      throw new Error(`Failed to restore task "${taskId}"`);
    }

    const today = toIsoDate(new Date());

    const [row] = await db
      .select({
        task: tasks,
        task_completion: task_completions,
        project: {
          id: projects.id,
          name: projects.name,
          color: projects.color,
        },
      })
      .from(tasks)
      .leftJoin(projects, eq(tasks.project_id, projects.id))
      .leftJoin(
        task_completions,
        and(
          eq(tasks.id, task_completions.task_id),
          eq(task_completions.completion_date, today),
        ),
      )
      .where(eq(tasks.id, updatedTask.id))
      .limit(1);

    if (!row) {
      throw new Error(`Failed to fetch restored task "${taskId}"`);
    }

    const isRepeating = Boolean(row.task.repeat?.length);

    const task: TaskStateData = {
      ...row.task,
      project: row.project,

      repeat_today_status: isRepeating
        ? row.task_completion
          ? "completed_today"
          : "not_completed_today"
        : null,
    };

    return task;
  } catch (error) {
    return throwDbError(error, "Failed to restore task");
  }
};

export const completeRepeatTaskRepo = async (
  taskId: string | null,
  completionDate: IsoDate,
) => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const now = new Date();

    await db.insert(task_completions).values({
      id: createId(),
      task_id: taskId,
      completed_at: getUnixTime(now),
      completion_date: completionDate,
    });
  } catch (error) {
    return throwDbError(error, "Failed to complete a task");
  }
};

export const restoreRepeatTaskRepo = async (
  taskId: string,
  completionDate: IsoDate,
) => {
  try {
    if (!taskId) {
      throw new Error("Task ID is required");
    }

    if (!completionDate) {
      throw new Error("Completion date is required");
    }

    await db
      .delete(task_completions)
      .where(
        and(
          eq(task_completions.task_id, taskId),
          eq(task_completions.completion_date, completionDate),
        ),
      );
  } catch (error) {
    return throwDbError(error, "Failed to restore task");
  }
};
