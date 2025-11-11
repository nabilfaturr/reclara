import Markdown from "@/components/shared/markdown";
import { Summary } from "@reclara/db/schemas/summary.schema";
import { YouTubeFrame } from "./youtube.frame";
import { ProcessAnimation } from "./process.animation";

const ErrorState = ({ message }: { message: string }) => (
  <div className="relative text-center top-95">
    <div className="mx-auto max-w-md space-y-4 font-sans">
      <p className="text-3xl font-semibold text-destructive">{message}</p>
      <p className="text-sm text-muted-foreground">
        Try submitting a different video or check your connection.
      </p>
    </div>
  </div>
);

const NoSummary = () => (
  <div className="relative text-center top-95">
    <p className="font-vt323 text-5xl font-semibold text-center">
      Lets create a summary from any youtube videos!
    </p>
  </div>
);

export function SummaryResult({ summary }: { summary: Summary | null }) {
  const showVideo =
    summary?.state === "start_transcript" ||
    summary?.state === "start_summarizing" ||
    summary?.state === "finished" ||
    summary?.state === "error";

  if (!summary) return <NoSummary />;

  return (
    <div className="px-2">
      {summary?.state === "pending" && (
        <ProcessAnimation text="Fetch youtube video" />
      )}
      {summary?.state === "error" && (
        <ErrorState message="Failed to process the video. Please try again." />
      )}
      {showVideo && summary?.state !== "error" && (
        <div className="space-y-2">
          <YouTubeFrame videoId={summary.videoId} />
          {summary?.state === "start_transcript" && (
            <ProcessAnimation text="Transcripting the video" />
          )}
          {summary?.state === "start_summarizing" && (
            <ProcessAnimation text="Summarizing" />
          )}
          {summary?.state === "finished" && summary.summarize && (
            <Markdown content={summary.summarize} />
          )}
        </div>
      )}
    </div>
  );
}
