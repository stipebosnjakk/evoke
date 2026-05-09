import { eq, desc, and } from "drizzle-orm";

import { db, list_order, tasks } from "@/db";
import { throwDbError } from "@/utils/handleErrorMessage";
import { ScopeType, TasksObjectType } from "@/types/initialState.types";

export const fetchActiveTasks = async (): Promise<TasksObjectType> => {
  try {
    const rows = await db
      .select()
      .from(tasks)
      .where(and(eq(tasks.is_deleted, false), eq(tasks.is_completed, false)));

    const data: TasksObjectType = {
      ids: [],
      byId: {},
    };

    for (const row of rows) {
      data.ids.push(row.id);
      data.byId[row.id] = row;
    }

    return data;
  } catch (error) {
    return throwDbError(error, "Failed get tasks");
  }
};

export const fetchScopeOrder = async (scopeId: string): Promise<ScopeType> => {
  try {
    if (!scopeId) {
      throw Error("Scope ID is required");
    }

    const rows = await db
      .select({
        task_id: list_order.task_id,
        order_key: list_order.order_key,
      })
      .from(list_order)
      .where(eq(list_order.scope_id, scopeId))
      .orderBy(desc(list_order.order_key));

    const data: ScopeType = {};

    for (const row of rows) {
      data[row.task_id] = row.order_key;
    }

    return data;
  } catch (error) {
    return throwDbError(error, "Failed get order keys");
  }
};
