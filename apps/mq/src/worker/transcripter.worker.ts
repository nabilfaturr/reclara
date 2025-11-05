import fs from "fs/promises";
import { Worker } from "bullmq";
import {
  connection,
  summaryQueue,
  type TranscriptJobData,
} from "@reclara/redis";
import { updateErrorSummary, updateSummary } from "@reclara/db";
import { cleanSubtitle, downloadWithShell } from "../utils";

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

      console.log(`[VTT CONTENT]`, vttContent.slice(0, 25), "...");

      const cleanedText = cleanSubtitle(vttContent);

      console.log(`[CLEANED TEXT]`, cleanedText.slice(0, 25), "...");

      console.log("=== Transcript Worker Done ===");

      return { cleanedText };
    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      await updateErrorSummary({
        id: job.data.id as string,
        userId: job.data.userId,
      });
      throw error;
    }
  },
  { connection, concurrency: 5 }
);

transcriptWorker.on("completed", async (job, returnvalue) => {
  try {
    if (!returnvalue?.cleanedText) {
      console.error(
        `[COMPLETED] Job ${job.id} completed but missing cleanedText. This should not happen.`
      );
      await updateErrorSummary({
        id: job.data.id as string,
        userId: job.data.userId,
      });
      return;
    }

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
  } catch (error) {
    console.error(`Error in completed handler for job ${job.id}:`, error);
    await updateErrorSummary({
      id: job.data.id as string,
      userId: job.data.userId,
    });
  }
});

transcriptWorker.on("failed", async (job, err) => {
  if (!job) return;
  console.error(`❌ Job ${job?.id} failed:`, err);
  await updateErrorSummary({
    id: job.data.id as string,
    userId: job.data.userId,
  });
});
