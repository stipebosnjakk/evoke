import * as t from "drizzle-orm/sqlite-core";

export const list_order = t.sqliteTable(
  "list_order",
  {
    container_id: t.text("container_id").notNull(),
    task_id: t.text("task_id").notNull(),
    order_key: t.real("order_key").notNull(),
    updated_at: t
      .integer("updated_at")
      .notNull()
      .$defaultFn(() => Date.now()),
  },
  (table) => [
    t.primaryKey({ columns: [table.container_id, table.task_id] }),
    t.index("index_container_order").on(table.container_id, table.order_key),
  ],
);
