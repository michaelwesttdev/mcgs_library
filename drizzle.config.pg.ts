// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/db/sqlite/schema.ts",
  out: "./src/lib/db/sqlite/drizzle",
  driver: "pglite",
  dbCredentials: {
    url: "",
  },
  dialect: "postgresql",
  verbose: true,
  strict: true,
} satisfies Config;
