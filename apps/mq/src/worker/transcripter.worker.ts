import fs from "fs/promises";
import { Worker } from "bullmq";
import {
  connection,
  summaryQueue,
  type TranscriptJobData,
} from "@reclara/redis";
import { errorSummary, updateSummary } from "@reclara/db";
import { cleanSubtitle, downloadWithShell } from "../utils";
import { error } from "console";

const transcriptWorker = new Worker<TranscriptJobData>(
  "transcript-queue",
  async (job) => {
    try {
      console.log(`=== Transcripter Worker ===`);

      await updateSummary({
        id: job.data.id as string,
        userId: job.data.userId,
        videoId: job.data.videoId,
        model: job.data.model,
        state: "start_transcript",
      });

      const videoUrl = `https://www.youtube.com/watch?v=${job.data.videoId}`;

      if (!videoUrl) {
        throw new Error("Video URL is undefined. Cannot run yt-dlp.");
      }

      const { location } = await downloadWithShell(videoUrl, {
        customFilename: `subs-${job.id}`,
      });

      const vttContent = await fs.readFile(location, "utf-8");

      const cleanedText = cleanSubtitle(vttContent);

      console.log("=== Transcript Worker Done ===");

      return { cleanedText };
    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      await errorSummary({
        id: job.data.id as string,
        userId: job.data.userId,
      });
    }
  },
  { connection }
);

transcriptWorker.on("completed", async (job, returnvalue) => {
  const summary = await updateSummary({
    id: job.data.id as string,
    userId: job.data.userId,
    videoId: job.data.videoId,
    model: job.data.model,
    transcript: returnvalue.cleanedText,
    state: "success_transcript",
  });

  console.log(`[COMPLETED] Job ${job.id} completed.`);

  if (summary) return await summaryQueue.add("summary-queue", summary);

  await errorSummary({
    id: job.data.id as string,
    userId: job.data.userId,
  });
});

transcriptWorker.on("failed", async (job, err) => {
  if (!job) return;
  console.error(`❌ Job ${job?.id} failed:`, err);
  await errorSummary({
    id: job.data.id as string,
    userId: job.data.userId,
  });
});
