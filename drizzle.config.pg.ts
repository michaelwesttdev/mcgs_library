// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  driver: "pglite",
  dbCredentials: {
    url: "",
  },
  dialect: "postgresql",
  verbose: true,
  strict: true,
} satisfies Config;
