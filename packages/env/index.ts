import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const fileURL = import.meta.url;
const filePath = fileURLToPath(fileURL);
const __dirname = dirname(filePath);

const envPath = join(__dirname, "../../.env.local");

config({
  path: envPath,
});

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  REDIS_PORT: process.env.REDIS_PORT || "6379",
  TURSO_CONNECTION_URL: process.env.TURSO_CONNECTION_URL || "",
  TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN || "",
  FIREWORKS_API_KEY: process.env.FIREWORKS_API_KEY || "",
};

export default env;
