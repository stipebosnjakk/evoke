import * as t from "drizzle-orm/sqlite-core";

export const list_order = t.sqliteTable(
  "list_order",
  {
    scope_id: t.text("scope_id").notNull(),
    task_id: t.text("task_id").notNull(),
    order_key: t.real("order_key").notNull(),
    created_at: t
      .integer("created_at")
      .notNull()
      .$defaultFn(() => Date.now()),
    updated_at: t.integer("updated_at"),
  },
  (table) => [
    t.primaryKey({ columns: [table.scope_id, table.task_id] }),
    t.index("index_scope_order").on(table.scope_id, table.order_key),
  ],
);
