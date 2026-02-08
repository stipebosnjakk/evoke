import * as t from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { TaskStatus } from "@/types/create.types";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export const tasks = t.sqliteTable("tasks", {
  id: t
    .text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: t.text("title").notNull(),
  created_at: t
    .integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
  updated_at:t.integer("updated_at"),
  completed_at: t.integer("completed_at"),
  is_deleted: t
    .integer("is_deleted", { mode: "boolean" })
    .notNull()
    .default(false),
  status: t.text("status").$type<TaskStatus>(),
  project_id: t.text("project_id"),
  section_id: t.text("section_id"),
  area_id: t.text("area_id"),
  start_date: t.integer("start_date"),
  due_date: t.integer("due_date"),
  sort_order: t.real("sort_order").notNull(),
  duration_min: t.integer("duration_min"),
  recurrence_rule: t.text("recurrence_rule"),
});

export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;
