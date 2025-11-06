import type { RedisOptions } from "ioredis";
import env from "@reclara/env";

if (env.NODE_ENV !== "production") {
  console.log("Redis Connection Config:", {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD ? "***" : "(no password)",
  });
}

export const connection: RedisOptions = {
  host: env.REDIS_HOST || "127.0.0.1",
  port: parseInt(env.REDIS_PORT || "6379", 10),
  password: env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  retryStrategy: (times) => Math.min(times * 50, 2000),
};
