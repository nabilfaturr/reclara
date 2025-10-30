"use server";

export async function sendVideoURL(formData: FormData): Promise<boolean> {
  try {
    // TODO: auth check

    const videoUrl = formData.get("videoUrl") as string;
    const model = formData.get("model") as string;

    console.log("Received video URL:", videoUrl);
    console.log("Selected model:", model);

    // TODO: check if videoUrl is valid
    
    // TODO: send the videoUrl to the worker

    await new Promise((resolve) => setTimeout(resolve, 2000));

    return true;
  } catch (error) {
    console.error("Error processing video URL:", error);
    return false;
  }
}
