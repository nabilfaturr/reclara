import { and, eq } from "drizzle-orm";
import { summary } from "../schemas/summary.schema";
import type { NewSummary, Summary } from "../schemas/summary.schema";
import { db } from "../client";

export const createSummary = async ({
  model,
  userId,
  videoId,
}: NewSummary): Promise<Summary> => {
  const result = await db
    .insert(summary)
    .values({ model, userId, videoId })
    .returning();

  return result[0]!;
};

export const updateSummary = async ({
  id,
  state,
  userId,
  transcript,
  summarize,
}: NewSummary): Promise<Summary | undefined> => {
  const updateData: Record<string, unknown> = {};

  if (transcript !== undefined) updateData.transcript = transcript;
  if (summarize !== undefined) updateData.summarize = summarize;
  if (state !== undefined) updateData.state = state;

  const result = await db
    .update(summary)
    .set(updateData)
    .where(and(eq(summary.id, id), eq(summary.userId, userId)))
    .returning();

  return result[0];
};
