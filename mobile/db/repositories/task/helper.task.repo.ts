import { eq, and, desc } from "drizzle-orm";

import { db, list_order, Task, tasks } from "@/db";
import { isInboxTask } from "@/utils/taskPlacement";
import { INBOX_SCOPE_ID } from "@/constants/scopeIds";

type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

type FindTaskByIdArgs = {
  tx: Transaction;
  taskId: string;
};

export const findTaskById = async ({
  taskId,
  tx,
}: FindTaskByIdArgs): Promise<Task | null> => {
  const [task] = await tx
    .select()
    .from(tasks)
    .where(eq(tasks.id, taskId))
    .limit(1);

  return task ?? null;
};

type OrderKeyHelperType = {
  tx: Transaction;
  task: Task;
};

type OrderKeyHelperReturnType = {
  inboxOrderKey: number | null;
  projectOrderKey: number | null;
};

export const handleGetOrCreateOrderKey = async ({
  tx,
  task,
}: OrderKeyHelperType): Promise<OrderKeyHelperReturnType> => {
  if (!task) {
    throw new Error("Task is required");
  }

  let inboxOrderKey: number | null = null;
  let projectOrderKey: number | null = null;

  const isInbox = isInboxTask(task);
  const projectScope = task.project_id;

  if (!isInbox && !projectScope) {
    return {
      inboxOrderKey: null,
      projectOrderKey: null,
    };
  }

  if (isInbox) {
    const [existingInboxOrderKey] = await tx
      .select({ orderKey: list_order.order_key })
      .from(list_order)
      .where(
        and(
          eq(list_order.item_id, task.id),
          eq(list_order.scope_id, INBOX_SCOPE_ID),
        ),
      )
      .limit(1);

    if (existingInboxOrderKey) {
      inboxOrderKey = existingInboxOrderKey.orderKey;
    }

    if (!existingInboxOrderKey) {
      const [lastInboxOrderKey] = await tx
        .select({ orderKey: list_order.order_key })
        .from(list_order)
        .where(eq(list_order.scope_id, INBOX_SCOPE_ID))
        .orderBy(desc(list_order.order_key))
        .limit(1);

      inboxOrderKey = (lastInboxOrderKey?.orderKey ?? 0) + 1000;

      await tx.insert(list_order).values({
        scope_id: INBOX_SCOPE_ID,
        item_id: task.id,
        order_key: inboxOrderKey,
      });
    }
  }

  if (projectScope) {
    const [existingProjectOrderKey] = await tx
      .select({ orderKey: list_order.order_key })
      .from(list_order)
      .where(
        and(
          eq(list_order.scope_id, projectScope),
          eq(list_order.item_id, task.id),
        ),
      )
      .limit(1);

    if (existingProjectOrderKey) {
      projectOrderKey = existingProjectOrderKey.orderKey;
    }

    if (!existingProjectOrderKey) {
      const [lastProjectOrderKey] = await tx
        .select({ orderKey: list_order.order_key })
        .from(list_order)
        .where(eq(list_order.scope_id, projectScope))
        .orderBy(desc(list_order.order_key))
        .limit(1);

      projectOrderKey = (lastProjectOrderKey?.orderKey ?? 0) + 1000;

      await tx.insert(list_order).values({
        item_id: task.id,
        scope_id: projectScope,
        order_key: projectOrderKey,
      });
    }
  }

  return {
    inboxOrderKey,
    projectOrderKey,
  };
};
