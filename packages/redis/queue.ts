import { connection } from "./connection";
import { Queue } from "bullmq";
import type { NewSummary } from "@reclara/db/schemas/summary.schema";

export type TranscriptJobData = NewSummary;

export const transcriptQueue = new Queue<TranscriptJobData>(
  "transcript-queue",
  { connection }
);

export const summaryQueue = new Queue<TranscriptJobData>("summary-queue", {
  connection,
});
