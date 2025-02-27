// drizzle.config.ts
import type { Config } from "drizzle-kit";
import path from "path";
import os from "os";
import fs from "fs";

function getUrl() {
  const appPath = path.join(os.homedir(), "Documents", "mcs", "library");
  if (!fs.existsSync(appPath)) {
    fs.mkdirSync(appPath, { recursive: true });
  }
  const dbPath = path.join(appPath, "library.db");
  return dbPath;
}
export default {
  schema: "./src/lib/db/sqlite/schema.ts",
  out: "./src/lib/db/sqlite/drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: getUrl(),
  },
  verbose: true,
  strict: true,
} satisfies Config;
