import { SUPPORTED_LLM_MODELS } from "../../constants";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { user } from "./auth.schema";

export const summarizeState = [
  "pending",
  "start_transcript",
  "success_transcript",
  "start_summarizing",
  "finished",
  "error",
] as const;

export const summary = sqliteTable("summary", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  videoId: text("video_id", { length: 11 }).notNull(),

  transcript: text("transcript"),
  summarize: text("summarize"),

  model: text("model", { enum: SUPPORTED_LLM_MODELS }).notNull(),

  state: text("state", { enum: summarizeState }).default("pending").notNull(),

  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),

  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});
