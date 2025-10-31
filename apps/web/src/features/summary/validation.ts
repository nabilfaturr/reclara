import { SUPPORTED_LLM_MODELS } from "@reclara/constants";
import z from "zod";
import { youtubeUrlRegex, youtubeShortRegex } from "./constant";

export const formSchema = z.object({
  videoUrl: z
    .string()
    .trim()
    .refine(
      (val: string) =>
        youtubeUrlRegex.test(val) ||
        val.startsWith("youtube.com/watch?v=") ||
        val.startsWith("www.youtube.com/watch?v=") ||
        youtubeShortRegex.test(val),
      {
        message: "Invalid YouTube URL or ID",
      }
    ),
  model: z.enum([...SUPPORTED_LLM_MODELS]),
});
