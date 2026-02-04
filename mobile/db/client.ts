import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema/index";

const db_name = "evoke.db";
const expo = openDatabaseSync(db_name, { enableChangeListener: true });
export const db = drizzle(expo, { schema });
