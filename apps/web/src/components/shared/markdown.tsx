// TODO : split into two components : one for static markdown rendering and one for streaming markdown rendering

"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type MarkdownProps = {
  content: string;
  streaming?: boolean;
  streamSpeed?: number; // characters per tick
  streamDelay?: number; // milliseconds between ticks
};

export default function Markdown({
  content,
  streaming = true,
  streamSpeed = 2,
  streamDelay = 2,
}: MarkdownProps) {
  const [displayedContent, setDisplayedContent] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!streaming) {
      setDisplayedContent(content);
      setIsComplete(true);
      return;
    }

    setDisplayedContent("");
    setIsComplete(false);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < content.length) {
        const nextIndex = Math.min(currentIndex + streamSpeed, content.length);
        setDisplayedContent(content.slice(0, nextIndex));
        currentIndex = nextIndex;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, streamDelay);

    return () => clearInterval(interval);
  }, [content, streaming, streamSpeed, streamDelay]);

  return (
    <div className="prose prose-neutral max-w-none dark:prose-invert overflow-y-auto font-sans pt-10 pb-3 px-2">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {displayedContent}
      </ReactMarkdown>
    </div>
  );
}
