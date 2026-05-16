import { eq, desc } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

import { db, list_order, NewTask, tasks } from "@/db";
import { throwDbError } from "@/utils/error";
import { INBOX_SCOPE_ID } from "@/constants/scopeIds";
import { isInboxTask } from "@/utils/taskPlacement";
import { TaskWithOrderKey } from "@/types/task.types";

// TODO: for some reason all of my tasks has order key around 5000

export const createTaskRepo = async (
  task: NewTask,
): Promise<TaskWithOrderKey> => {
  try {
    return await db.transaction(async (tx) => {
      const id = createId();
      const isInbox = isInboxTask(task);
      let newOrderKey: number | null = null;

      if (isInbox) {
        const last = await tx
          .select()
          .from(list_order)
          .where(eq(list_order.scope_id, INBOX_SCOPE_ID))
          .orderBy(desc(list_order.order_key))
          .limit(1);

        const maxOrderKey = last[0]?.order_key ?? 0;
        newOrderKey = maxOrderKey + 1000 || 1000;

        await tx.insert(list_order).values({
          scope_id: INBOX_SCOPE_ID,
          task_id: id,
          order_key: newOrderKey,
        });
      }

      const {
        title,
        description,
        status,
        start_date,
        start_time_min,
        duration_min,
        deadline,
        repeat,
      } = task;

      if (!title) {
        throw new Error("Title is required");
      }

      await tx.insert(tasks).values({
        id,
        title,
        description,
        status,
        start_date,
        start_time_min,
        duration_min,
        deadline,
        repeat,
      });

      const [createdTask] = await tx
        .select()
        .from(tasks)
        .where(eq(tasks.id, id))
        .limit(1);

      if (!createdTask) {
        throw new Error("Failed to create task");
      }

      return {
        task: createdTask,
        order_key: newOrderKey,
      };
    });
  } catch (error: unknown) {
    return throwDbError(error, "Failed to create task");
  }
};
