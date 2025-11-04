import env from "@reclara/env";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";

export const db: LibSQLDatabase = drizzle({
  connection: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
});
