import { sqliteTable as table } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { text, sqliteTable } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

export const tasks = table("tasks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
});
