import { createAsyncThunk } from "@reduxjs/toolkit";
import { createId } from "@paralleldrive/cuid2";
import { and, eq, isNull, sql } from "drizzle-orm";

import { db, tasks, type Task } from "@/db";

type ReturnType = {
  data: Task[];
  total: number;
};

export const fetchInboxTasks = createAsyncThunk<
  ReturnType,
  { limit: number; offset: number },
  { rejectValue: { errorMessage: string | null } }
>("tasks/fetchInbox", async ({ limit, offset }, { rejectWithValue }) => {
  try {
    const where = and(
      eq(tasks.is_deleted, false),
      isNull(tasks.project_id),
      isNull(tasks.area_id),
      isNull(tasks.section_id),
      isNull(tasks.status),
      isNull(tasks.start_date),
      isNull(tasks.due_date),
      isNull(tasks.completed_at),
    );

    const rows = await db
      .select()
      .from(tasks)
      .where(where)
      .limit(limit)
      .offset(offset)
      .orderBy(tasks.created_at);

    const totalResult = await db
      .select({ total: sql<number>`count(*)` })
      .from(tasks)
      .where(where);

    return {
      data: rows,
      total: totalResult[0]?.total ?? 0,
    };
  } catch (e: any) {
    return rejectWithValue({
      errorMessage: e?.message ?? "Something went wrong",
    });
  }
});

export const quickAddTask = createAsyncThunk(
  "tasks/quickAdd",
  async ({ title }: { title: string }, { rejectWithValue }) => {
    const trimmed = title.trim();

    if (!trimmed) return rejectWithValue("Title is required");
    if (trimmed.length > 255)
      return rejectWithValue("Title must be less than 255 characters");

    const id = createId();
    await db.insert(tasks).values({ id, title: trimmed });

    const rows = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    const task = rows[0];
    if (!task) return rejectWithValue("Failed to create task");

    return task as Task;
  },
);
