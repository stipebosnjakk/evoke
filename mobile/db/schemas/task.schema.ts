import * as t from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

import { TaskStatus, IsoDate } from "@/types/task.types";

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
  completed_at: t.integer("completed_at"),
  is_deleted: t
    .integer("is_deleted", { mode: "boolean" })
    .notNull()
    .default(false),
  status: t.text("status").$type<TaskStatus>(),
  project_id: t.text("project_id"),
  section_id: t.text("section_id"),
  area_id: t.text("area_id"),
  start_date: t.text("start_date").$type<IsoDate | null>(),
  start_time_min: t.integer("start_time_min"),
  due_time_min: t.integer("due_time_min"),
  deadline: t.text("deadline").$type<IsoDate | null>(),
  repeat: t.text("repeat"),
});

export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;
