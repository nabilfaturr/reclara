import type { RedisOptions } from "ioredis";

export const connection: RedisOptions = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  maxRetriesPerRequest: null,
  retryStrategy: (times) => Math.min(times * 50, 2000),
};
