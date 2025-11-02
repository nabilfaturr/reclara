import { Worker } from "bullmq";
import { connection } from "@reclara/redis";
import { fetchFireworks, generatePrompt, saveCleanedSubtitle } from "@/utils";
import { errorSummary, updateSummary } from "@reclara/db";

const worker = new Worker(
  "summary-queue",
  async (job) => {
    try {
      console.log(`[PROCESSING] Job ${job.id} started`);
      const { transcript } = job.data;

      if (!transcript) {
        throw new Error("Transcript is required");
      }

      await updateSummary({
        id: job.data.id as string,
        userId: job.data.userId,
        videoId: job.data.videoId,
        model: job.data.model,
        state: "start_summarizing",
      });

      const prompt = generatePrompt(transcript);

      const response = await fetchFireworks("gpt-oss-120b", prompt, {
        max_tokens: 2000,
        temperature: 0.2,
      });

      const data = response.choices[0]?.text;
      console.log({ data });

      if (!data) {
        throw new Error("No response from Fireworks API");
      }

      
      const content = JSON.parse(data).content;
      console.log({ content });

      console.log("=== Summary Worker Done ===");
      return content;
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

worker.on("completed", async (job, result) => {
  console.log(`[COMPLETED] Job ${job.id} completed with result:`, result);
  await updateSummary({
    id: job.data.id as string,
    userId: job.data.userId,
    videoId: job.data.videoId,
    model: job.data.model,
    summarize: result,
    state: "finished",
  });
});

worker.on("failed", async (job, err) => {
  if (!job) return;
  console.error(`[ERROR] Job ${job?.id} failed:`, err);
  await errorSummary({
    id: job.data.id as string,
    userId: job.data.userId,
  });
});
