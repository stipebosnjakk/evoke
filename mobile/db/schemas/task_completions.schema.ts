import * as t from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { InferSelectModel } from "drizzle-orm";

export const task_completions = t.sqliteTable(
  "task_completions",
  {
    id: t
      .text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    task_id: t.text("task_id").notNull(),
    completed_at: t.integer("completed_at").notNull(),
    completion_date: t.text("completion_date").notNull(),
  },
  (table) => [
    t
      .uniqueIndex("task_completion_once_per_day")
      .on(table.task_id, table.completion_date),
  ],
);

export type TaskCompletion = InferSelectModel<typeof task_completions>;
