import { $ } from "bun";
import path from "path";
import { delay, withRetry } from "./retry.js";

export async function downloadWithShell(
  url: string,
  options: {
    downloadType?: "subtitles" | "audio" | "video" | "all";
    subtitleLangs?: string[];
    outputDir?: string;
    customFilename?: string;
  } = {}
) {
  if (!url) {
    throw new Error("URL is required for download.");
  }

  const BASE_FOLDER = process.cwd();
  console.log("[HOME] Working directory:", BASE_FOLDER);

  const {
    downloadType = "subtitles",
    subtitleLangs = ["en", "id"],
    outputDir = "./downloads",
    customFilename,
  } = options;

  const absoluteOutputDir = path.resolve(outputDir);
  console.log("[FOLDER] Output directory:", absoluteOutputDir);

  try {
    // Buat folder
    await $`mkdir -p ${absoluteOutputDir}`;
    console.log("[SUCCESS] Directory created/exists");

    // Output template
    const outputTemplate = customFilename
      ? `${absoluteOutputDir}/${customFilename}`
      : `${absoluteOutputDir}/[%(uploader)s] - %(title)s`;

    console.log("[CONFIG] Output template:", outputTemplate);

    // Cek subtitle availability
    console.log("[SEARCH] Checking available subtitles...");
    const checkSubsOutput = await withRetry(
      () => $`yt-dlp "${url}" --list-subs`.text(),
      2
    );

    const hasManualSubs = checkSubsOutput.includes("Available subtitles");
    const hasAutoSubs = checkSubsOutput.includes(
      "Available automatic captions"
    );

    console.log(`[INFO] Manual subtitles: ${hasManualSubs ? "Yes" : "No"}`);
    console.log(
      `[INFO] Auto-generated subtitles: ${hasAutoSubs ? "Yes" : "No"}`
    );

    const downloadedSubs = [] as string[];
    let hasDownloaded = false;

    if (hasAutoSubs) {
      console.log("\n[DOWNLOAD] Attempting auto-generated subtitles...");
      for (const lang of subtitleLangs) {
        if (hasDownloaded) break;
        try {
          console.log(`  Trying ${lang}...`);
          await withRetry(
            () =>
              $`yt-dlp "${url}" --write-auto-subs --skip-download --sub-langs ${lang} --output "${outputTemplate}.%(ext)s"`.text(),
            3
          );
          downloadedSubs.push(lang);
          hasDownloaded = true;
          console.log(`  [SUCCESS] Auto ${lang} downloaded`);
          await delay(2000);
        } catch (error: any) {
          const errorMsg = error.stderr?.toString() || "";
          if (errorMsg.includes("429")) {
            console.warn(`  [WARNING] Rate limited for ${lang}. Skipping...`);
          } else if (errorMsg.includes("Unable to download")) {
            console.log(`  [WARNING] Auto ${lang} not available`);
          } else {
            throw error;
          }
        }
      }
    } else {
      console.log(
        "[WARNING] No auto-generated subtitles available for this video."
      );
    }
    // Check hasil
    const totalDownloaded = downloadedSubs.length;

    if (totalDownloaded === 0) {
      throw new Error(
        "No subtitles found. Video may not have subtitles in requested languages."
      );
    }

    return {
      success: true,
      location: outputTemplate + `.${downloadedSubs[0]}.vtt`,
    };
  } catch (error: any) {
    console.error("\n[ERROR] Download failed:", error.message);

    if (error.stderr) {
      const stderrMsg = new TextDecoder().decode(error.stderr);
      if (stderrMsg.includes("429")) {
        console.error(
          "[TIP] YouTube rate limited. Wait a few minutes and try again."
        );
      }
      if (stderrMsg.includes("Unable to download")) {
        console.error(
          "[TIP] Subtitles not available for this video in requested languages."
        );
      }
    }

    throw error;
  }
}
