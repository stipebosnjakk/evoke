import { eq } from "drizzle-orm";

import { db, Task, tasks } from "@/db";

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
