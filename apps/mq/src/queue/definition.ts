import { connection } from "@reclara/redis";
import { Queue } from "bullmq";

export const transcriptQueue = new Queue("transcript-queue", { connection });
export const summaryQueue = new Queue("summary-queue", { connection });
