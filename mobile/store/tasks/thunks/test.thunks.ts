import { createAsyncThunk } from "@reduxjs/toolkit";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";

import { tasks } from "@/db/schemas/task.schema";
import { db } from "@/db/client";
import { RejectWithValue, TaskWithOrderKey } from "@/types/task.types";
import { handleErrorMessage } from "@/utils/handleErrorMessage";
import { INBOX_CONTAINER_ID } from "@/constants/containerIds";
import { list_order } from "@/db";

export const deleteAllTasksAction = createAsyncThunk<
  void,
  void,
  { rejectValue: RejectWithValue }
>("tasks/deleteAll", async (_, { rejectWithValue }) => {
  try {
    await db.delete(tasks);
    await db.delete(list_order);
  } catch (error: unknown) {
    return rejectWithValue({
      message: handleErrorMessage(error, "Failed to delete all tasks"),
    });
  }
});

export const seedInboxOrderKeysTestAction = createAsyncThunk<
  TaskWithOrderKey[],
  void,
  { rejectValue: RejectWithValue }
>("tasks/seedInboxOrderKeysTest", async (_, { rejectWithValue }) => {
  try {
    return await db.transaction(async (tx) => {
      const now = Date.now();
      const seeds = [
        { title: "Seed task 5000", order_key: 5000 },
        { title: "Seed task 4000", order_key: 4000 },
        { title: "Seed task 3000", order_key: 3000 },
        { title: "Seed task 2000", order_key: 2000 },
        { title: "Seed task 1000", order_key: 1000 },
      ];

      await tx.delete(list_order);
      await tx.delete(tasks);

      const created: TaskWithOrderKey[] = [];

      for (const s of seeds) {
        const id = createId();

        await tx.insert(tasks).values({
          id,
          title: s.title,
          created_at: now,
          updated_at: null,
          completed_at: null,
          is_deleted: false,
          status: null,
          project_id: null,
          section_id: null,
          area_id: null,
          start_date: null,
          start_time_min: null,
          due_time_min: null,
          deadline: null,
          repeat: null,
        });

        await tx.insert(list_order).values({
          container_id: INBOX_CONTAINER_ID,
          task_id: id,
          order_key: s.order_key,
          created_at: now,
          updated_at: null,
        });

        const rows = await tx
          .select()
          .from(tasks)
          .where(eq(tasks.id, id))
          .limit(1);
        const task = rows[0];
        if (!task) throw new Error("Failed to create task");

        created.push({ ...task, order_key: s.order_key } as TaskWithOrderKey);
      }

      return created;
    });
  } catch (error: unknown) {
    return rejectWithValue({
      message: handleErrorMessage(error, "Failed to seed inbox order keys"),
    });
  }
});
