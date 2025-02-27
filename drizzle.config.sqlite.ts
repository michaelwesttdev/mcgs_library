// drizzle.config.ts
import type { Config } from "drizzle-kit";
import { getDBUrl } from "./src/lib/utilities/dbPathGetter";

export default {
  schema: ".src/lib/db/sqlite/schema.ts",
  out: ".src/lib/db/sqlite/drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: getDBUrl(),
  },
  verbose: true,
  strict: true,
} satisfies Config;
