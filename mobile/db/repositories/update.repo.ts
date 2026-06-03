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

export const completeTask = async (taskId: string) => {
  try {
    const now = getUnixTime(new Date());

    if (!taskId) {
      throw new Error("Task ID is required");
    }

    const [task] = await db
      .update(tasks)
      .set({
        is_completed: true,
        completed_at_utc: now,
        updated_at: now,
      })
      .where(eq(tasks.id, taskId))
      .returning();

    if (!task) {
      throw new Error(`Failed to complete task "${taskId}""`);
    }

    return task;
  } catch (error) {
    return throwDbError(error, "Failed to complete task");
  }
};

export const rebalanceOrderKeys = async (
  orderArray: OrderTaskItem[],
  scopeId: string,
) => {
  try {
    if (!scopeId) {
      throw new Error("Scope ID cannot be empty");
    }

    if (orderArray.length === 0) {
      throw new Error("Order array cannot be empty");
    }

    await db.transaction(async (tx) => {
      for (const item of orderArray) {
        await tx
          .update(list_order)
          .set({ order_key: item.order_key })
          .where(
            and(
              eq(list_order.item_id, item.id),
              eq(list_order.scope_id, scopeId),
            ),
          );
      }
    });
  } catch (error: unknown) {
    return throwDbError(error, "Failed to rebalance order keys");
  }
};

export const updateTaskOrderKey = async (
  newOrder: OrderTaskItem,
  scopeId: string,
) => {
  try {
    const { id, order_key } = newOrder;

    if (!id) {
      throw new Error("Task ID is required");
    }

    if (!scopeId) {
      throw new Error("Scope ID is required");
    }

    if (!Number.isFinite(order_key)) {
      throw new Error(`New order key:${order_key} must be a valid number`);
    }

    const result = await db
      .update(list_order)
      .set({ order_key })
      .where(and(eq(list_order.item_id, id), eq(list_order.scope_id, scopeId)));

    if (!result) {
      throw new Error(
        `Failed to update order key for task "${id}" in scope "${scopeId}"`,
      );
    }
  } catch (error: unknown) {
    return throwDbError(error, "Failed to update task order key");
  }
};
