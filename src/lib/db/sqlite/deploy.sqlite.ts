import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import { getDBUrl } from "@/lib/utilities/dbPathGetter";

export async function runMigrate() {
  const sqlite = new Database(getDBUrl());
  const db = drizzle(sqlite, { schema });
  console.info("⌛Running migrations...");
  const start = Date.now();
  migrate(db, {
    migrationsFolder: `${__dirname}/drizzle`,
  });
  const end = Date.now();
  console.info(`✅Migrations completed. Took ${end - start}ms`);
}
