import * as t from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import { TaskStatus, IsoDate, Weekday } from "@/types/task.types";

export const tasks = t.sqliteTable("tasks", {
  id: t
    .text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: t.text("title"),
  description: t.text("description"),
  created_at: t
    .integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
  updated_at: t.integer("updated_at"),
  is_completed: t
    .integer("is_completed", { mode: "boolean" })
    .notNull()
    .default(false),
  completed_at_utc: t.integer("completed_at_utc"),
  status: t.text("status").$type<TaskStatus>(),
  project_id: t.text("project_id"),
  start_date: t.text("start_date").$type<IsoDate | null>(),
  start_time_min: t.integer("start_time_min"),
  duration_min: t.integer("duration_min"),
  deadline: t.text("deadline").$type<IsoDate | null>(),
  repeat: t.text("repeat", { mode: "json" }).$type<Weekday[] | null>(),
});

export type Task = InferSelectModel<typeof tasks>;
export type FormTask = InferInsertModel<typeof tasks>;
