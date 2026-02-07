import { createAsyncThunk } from "@reduxjs/toolkit";
import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";

import { db, tasks, type Task } from "@/db";

export const fetchAllTasks = createAsyncThunk("tasks/fetchAll", async () => {
  const rows = await db.select().from(tasks);
  return rows as Task[];
});

export const quickAddTask = createAsyncThunk(
  "tasks/quickAdd",
  async ({ title }: { title: string }, { rejectWithValue }) => {
    const trimmed = title.trim();

    if (!trimmed) return rejectWithValue("Title is required");
    if (trimmed.length > 255)
      return rejectWithValue("Title must be less than 255 characters");

    const id = createId();
    await db.insert(tasks).values({ id, title: trimmed, sort_order: 0 });

    const rows = await db.select().from(tasks).where(eq(tasks.id, id)).limit(1);
    const task = rows[0];
    if (!task) return rejectWithValue("Failed to create task");

    return task as Task;
  },
);
