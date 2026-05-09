import { eq, and } from "drizzle-orm";

import { db, list_order } from "@/db";
import { OrderTaskItem } from "@/types/task.types";
import { throwDbError } from "@/utils/handleErrorMessage";

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
              eq(list_order.task_id, item.id),
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
      throw new Error("Task ID cannot be empty");
    }

    if (!scopeId) {
      throw new Error("Scope ID cannot be empty");
    }

    if (!Number.isFinite(order_key)) {
      throw new Error(`New order key:${order_key} must be a valid number`);
    }

    const result = await db
      .update(list_order)
      .set({ order_key })
      .where(and(eq(list_order.task_id, id), eq(list_order.scope_id, scopeId)));

    if (!result) {
      throw new Error(
        `Failed to update order key for task "${id}" in scope "${scopeId}"`,
      );
    }
  } catch (error: unknown) {
    return throwDbError(error, "Failed to update task order key");
  }
};
