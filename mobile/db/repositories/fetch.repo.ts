import { and, eq, isNull, desc, sql } from "drizzle-orm";

import { DataReturnType } from "@/types/task.types";
import { db, tasks, list_order } from "@/db";
import { INBOX_CONTAINER_ID } from "@/constants/containerIds";
import { throwDbError } from "@/utils/handleErrorMessage";

export const fetchInboxTasks = async (
  limit: number,
  offset: number,
): Promise<DataReturnType> => {
  try {
    const where = and(
      eq(list_order.container_id, INBOX_CONTAINER_ID),
      eq(tasks.is_deleted, false),
      isNull(tasks.project_id),
      isNull(tasks.area_id),
      isNull(tasks.section_id),
      isNull(tasks.status),
      isNull(tasks.start_date),
      isNull(tasks.start_time_min),
      isNull(tasks.duration_min),
      isNull(tasks.deadline),
      isNull(tasks.completed_at),
      isNull(tasks.repeat),
    );

    const [rows, totalResult] = await Promise.all([
      db
        .select({ task: tasks, order_key: list_order.order_key })
        .from(list_order)
        .innerJoin(tasks, eq(list_order.task_id, tasks.id))
        .where(where)
        .limit(limit)
        .offset(offset)
        .orderBy(desc(list_order.order_key)),
      db
        .select({ total: sql<number>`count(*)` })
        .from(list_order)
        .innerJoin(tasks, eq(list_order.task_id, tasks.id))
        .where(where),
    ]);

    return {
      data: rows.map((r) => ({
        ...r.task,
        order_key: r.order_key,
      })),
      total: Number(totalResult[0]?.total ?? 0),
    };
  } catch (error: unknown) {
    return throwDbError(error, "Failed to fetch Inbox tasks");
  }
};
