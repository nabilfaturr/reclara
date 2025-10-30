"use server";

import { createSummary } from "@db";
import { formSchema } from "./validation";
import { getSession } from "@/features/auth";
import { extractVideoIdFromUrl } from "./utils";
import { Summary } from "@db/schemas/summary.schema";

export async function sendVideoURL(
  formData: FormData
): Promise<Summary | false> {
  try {
    // TODO: auth check
    const session = await getSession();

    if (!session) {
      console.error("User not authenticated");
      return false;
    }

    const { user } = session;

    const videoUrl = formData.get("videoUrl") as string;
    const model = formData.get("model") as string;

    const body = {
      videoUrl,
      model,
    };

    const parsedBody = formSchema.safeParse(body);

    if (!parsedBody.success) {
      console.error("Invalid video URL or model:", parsedBody.error);
      return false;
    }

    // TODO: send the videoUrl to the worker
    const videoId = extractVideoIdFromUrl(parsedBody.data.videoUrl);

    const summarized = await createSummary({
      model: parsedBody.data.model,
      userId: user.id,
      videoId,
    });

    return summarized;
  } catch (error) {
    console.error("Error processing video URL:", error);
    return false;
  }
}
