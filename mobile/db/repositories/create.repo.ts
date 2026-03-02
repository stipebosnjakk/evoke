import { eq, desc } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

import { db, list_order, tasks } from "@/db";
import { TaskWithOrderKey } from "@/types/task.types";
import { throwDbError } from "@/utils/handleErrorMessage";
import { INBOX_CONTAINER_ID } from "@/utils/containerIds";

// TODO: for some reason all of my tasks has order key around 5000

export const createTaskRepo = async (
  title: string,
): Promise<TaskWithOrderKey> => {
  try {
    return await db.transaction(async (tx) => {
      if (title.trim() === "") {
        throw new Error("Task title cannot be empty");
      }

      const id = createId();

      await tx.insert(tasks).values({ id, title });

      const last = await tx
        .select({ order_key: list_order.order_key })
        .from(list_order)
        .where(eq(list_order.container_id, INBOX_CONTAINER_ID))
        .orderBy(desc(list_order.order_key))
        .limit(1);

      const maxOrderKey = last[0]?.order_key ?? 0;
      const nextOrderKey = maxOrderKey + 1000 || 1000;

      await tx.insert(list_order).values({
        container_id: INBOX_CONTAINER_ID,
        task_id: id,
        order_key: nextOrderKey,
      });

      const rows = await tx
        .select()
        .from(tasks)
        .where(eq(tasks.id, id))
        .limit(1);

      const task = rows[0];

      if (!task) {
        throw new Error("Failed to create task");
      }

      return {
        ...task,
        order_key: nextOrderKey,
      } as TaskWithOrderKey;
    });
  } catch (error: unknown) {
    return throwDbError(error, "Failed to create task");
  }
};
