import env from "@reclara/env";
import { defineConfig } from "drizzle-kit";

console.log("Turso Config:", {
  url: env.TURSO_CONNECTION_URL,
  authToken: env.TURSO_AUTH_TOKEN,
});

export default defineConfig({
  schema: ["packages/db/schemas/*.schema.ts"],
  out: "./migrations",
  dialect: "turso",
  dbCredentials: {
    url: env.TURSO_CONNECTION_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  },
});
