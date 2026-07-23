import * as t from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

import { ProjectStatus } from "@/types/project.types";
import { InferInsertModel, InferSelectModel } from "drizzle-orm";

export const projects = t.sqliteTable("projects", {
  id: t
    .text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: t.text("name").notNull(),
  color: t.text("color").notNull(),
  status: t.text("status").$type<ProjectStatus>().notNull().default("active"),
  completed_at: t.integer("completed_at"),
  created_at: t
    .integer("created_at")
    .notNull()
    .$defaultFn(() => Date.now()),
  updated_at: t.integer("updated_at"),
});

export type Project = InferSelectModel<typeof projects>;
export type NewProject = InferInsertModel<typeof projects>;
