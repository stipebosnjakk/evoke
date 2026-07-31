import { and, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { list_order } from "@/db/schemas";
import { OrderTaskItem } from "@/types/task.types";
import { throwDbError } from "@/utils/error";

export const updateTaskOrderKeysRepo = async (
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

    return { scopeId, orderArray };
  } catch (error: unknown) {
    return throwDbError(error, "Failed to update order keys");
  }
};
