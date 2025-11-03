import { Worker } from "bullmq";
import { connection } from "@reclara/redis";
import { fetchFireworks, generatePrompt, saveCleanedSubtitle } from "@/utils";
import { updateErrorSummary, updateSummary } from "@reclara/db";

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
      console.log(`[RESPONSE] `, response);

      const message = response.choices[0]?.message;
      console.log(`[MESSAGE] `, message);

      if (!message) {
        throw new Error("No Message Found");
      }

      const content = response.choices[0]?.message.content;
      console.log(`[CONTENT] `, content);

      if (!content) {
        throw new Error("No Content Found");
      }

      const parsedContent = JSON.parse(content)?.content;
      if (!parsedContent) {
        throw new Error("No parsedContentFound");
      }

      console.log(`[PARSED CONTENT] `, parsedContent);

      console.log("=== Summary Worker Done ===");
      return parsedContent;
    } catch (error) {
      console.error(`Error processing job ${job.id}:`, error);
      await updateErrorSummary({
        id: job.data.id as string,
        userId: job.data.userId,
      });
    }
  },
  { connection, concurrency: 5 }
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
  await updateErrorSummary({
    id: job.data.id as string,
    userId: job.data.userId,
  });
});
