import { eq, and } from "drizzle-orm";

import { db, list_order } from "@/db";
import { OrderTaskItem } from "@/types/task.types";
import { throwDbError } from "@/utils/handleErrorMessage";

export const rebalanceOrderKeys = async (
  orderArray: OrderTaskItem[],
  containerId: string,
) => {
  try {
    if (!containerId) {
      throw new Error("Container ID cannot be empty");
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
              eq(list_order.container_id, containerId),
            ),
          );
      }
    });
  } catch (error: unknown) {
    return throwDbError(error, "Failed to rebalance order keys");
  }
};

export const updateTaskOrderKey = async (
  taskId: string,
  containerId: string,
  newOrderKey: number,
) => {
  try {
    if (!taskId) {
      throw new Error("Task ID cannot be empty");
    }

    if (!containerId) {
      throw new Error("Container ID cannot be empty");
    }

    if (!Number.isFinite(newOrderKey)) {
      throw new Error("New order key must be a valid number");
    }

    await db
      .update(list_order)
      .set({ order_key: newOrderKey })
      .where(
        and(
          eq(list_order.task_id, taskId),
          eq(list_order.container_id, containerId),
        ),
      );
  } catch (error: unknown) {
    return throwDbError(error, "Failed to update task order key");
  }
};
