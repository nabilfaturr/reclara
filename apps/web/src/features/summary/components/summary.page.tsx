"use client";

import React from "react";
import { SummaryInput } from "@/features/summary/components/summary.input";
import { DEFAULT_LLM_MODEL } from "@constants";

export function SummaryPage() {
  const [selectedModel, setSelectedModel] = React.useState(DEFAULT_LLM_MODEL);

  return (
    <>
      <SummaryResult />
      <SummaryInput
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      />
    </>
  );
}

export function SummaryResult() {
  return (
    <div className="w-full max-w-2xl flex justify-center items-center">
      {/* <iframe
        width="95%"
        height="300"
        className="rounded-lg"
        src="https://www.youtube.com/embed/pHK2UxwfaL0?si=_F-Eh_KCAFcOj-jt"
        title="YouTube video player"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      ></iframe> */}
    </div>
  );
}
