import { drizzle, BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { getDBUrl } from "@/lib/utilities/dbPathGetter";
import { sql } from "drizzle-orm";

// Create a drizzle instance with the sqlite database
const globalDB = globalThis as unknown as {
  db: BetterSQLite3Database<typeof schema>;
};

function getDb() {
  globalDB.db = drizzle(getDBUrl(), { schema });
  return globalDB.db;
}

export const db = globalDB.db ?? getDb();
db.run(sql`PRAGMA foreign_keys = ON`);
