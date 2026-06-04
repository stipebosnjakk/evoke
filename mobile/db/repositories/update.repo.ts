import { eq, and } from "drizzle-orm";

import { db, list_order, projects, tasks } from "@/db";
import { OrderTaskItem, TaskStateData } from "@/types/task.types";
import { throwDbError } from "@/utils/error";
import { getUnixTime } from "date-fns";

export const restoreCompletedTask = async (
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

    return {
      ...row.task,
      project: row.project,
    };
  } catch (error) {
    return throwDbError(error, "Failed to restore task");
  }
};

export const completeTask = async (taskId: string): Promise<TaskStateData> => {
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

    return {
      ...row.task,
      project: row.project,
    };
  } catch (error) {
    return throwDbError(error, "Failed to complete task");
  }
};

export const updateOrderKeys = async (
  orderArray: OrderTaskItem[],
  scopeId: string,
) => {
  try {
    if (!scopeId) {
      throw new Error("Scope ID is required");
    }

    if (!orderArray.length) {
      throw new Error("Order array is required");
    }

    for (const { id, order_key } of orderArray) {
      if (!id) {
        throw new Error("Task ID is required");
      }
      if (!Number.isFinite(order_key)) {
        throw new Error(`Order key ${order_key} must be a valid number`);
      }
    }

    await db.transaction(async (tx) => {
      for (const { id, order_key } of orderArray) {
        await tx
          .update(list_order)
          .set({ order_key })
          .where(
            and(eq(list_order.item_id, id), eq(list_order.scope_id, scopeId)),
          );
      }
    });
  } catch (error: unknown) {
    return throwDbError(error, "Failed to update order keys");
  }
};
