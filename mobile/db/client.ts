import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema/index";

const expo = openDatabaseSync(process.env.EXPO_PUBLIC_DATABASE_NAME!, {
  enableChangeListener: true,
});
export const db = drizzle(expo, { schema });
