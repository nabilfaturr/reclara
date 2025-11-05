import { $ } from "bun";
import path from "path";
import fs from "fs/promises";
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

    // Download auto-generated subtitles
    console.log("\n[DOWNLOAD] Attempting auto-generated subtitles...");
    const downloadedSubs = [] as string[];
    let hasDownloaded = false;

    for (const lang of subtitleLangs) {
      if (hasDownloaded) break;
      try {
        console.log(`  Trying auto-generated ${lang}...`);
        
        // Run yt-dlp with STRICT auto-subs only (no manual fallback)
        await withRetry(
          () =>
            $`yt-dlp "${url}" --write-auto-subs --no-write-subs --skip-download --sub-langs ${lang} --output "${outputTemplate}.%(ext)s"`.text(),
          3
        );
        
        // ✅ CRITICAL: Verify file exists immediately after download
        const expectedFile = `${outputTemplate}.${lang}.vtt`;
        try {
          await fs.access(expectedFile);
          downloadedSubs.push(lang);
          hasDownloaded = true;
          console.log(`  [SUCCESS] ✅ Auto-generated ${lang} downloaded & verified`);
          await delay(500);
        } catch (fileError) {
          console.log(`  [WARNING] yt-dlp succeeded but file not found: ${expectedFile}`);
          console.log(`  [INFO] Video likely has no auto-generated ${lang} subtitles, trying next...`);
          // Continue to next language
        }
      } catch (error: any) {
        const errorMsg = error.stderr?.toString() || "";
        if (errorMsg.includes("429")) {
          console.warn(`  [WARNING] Rate limited for ${lang}. Skipping...`);
        } else if (errorMsg.includes("Unable to download")) {
          console.log(`  [WARNING] Auto-generated ${lang} not available`);
        } else {
          throw error;
        }
      }
    }
    const totalDownloaded = downloadedSubs.length;

    if (totalDownloaded === 0) {
      throw new Error(
        "No auto-generated subtitles available. Video does not have auto-generated subtitles in requested languages (en, id). Manual subtitles are not supported."
      );
    }

    const finalFile = `${outputTemplate}.${downloadedSubs[0]}.vtt`;
    console.log(`[FINAL] Auto-generated subtitle file ready: ${finalFile}`);

    return {
      success: true,
      location: finalFile,
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
