import { eq, desc } from "drizzle-orm";

import { db, list_order } from "@/db";
import { throwDbError } from "@/utils/error";
import { OrderObject } from "@/types/initialState.types";

export const fetchScopeOrderRepo = async (
  scopeId: string,
): Promise<OrderObject> => {
  try {
    if (!scopeId) {
      throw Error("Scope ID is required");
    }

    const rows = await db
      .select({
        task_id: list_order.item_id,
        order_key: list_order.order_key,
      })
      .from(list_order)
      .where(eq(list_order.scope_id, scopeId))
      .orderBy(desc(list_order.order_key));

    const data: OrderObject = {};

    for (const row of rows) {
      data[row.task_id] = row.order_key;
    }

    return data;
  } catch (error) {
    return throwDbError(error, "Failed get order keys");
  }
};
