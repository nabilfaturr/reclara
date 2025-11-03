"use client";

import React from "react";
import { SummaryInput } from "@/features/summary/components/summary.input";
import { DEFAULT_LLM_MODEL } from "@reclara/constants";
import { useControlledFetch } from "../hooks/useControlledFetch";
import { Summary } from "@reclara/db/schemas/summary.schema";
import { SummaryResult } from "./summary.result";

export function SummaryPage() {
  const [summary, setSummary] = React.useState<Summary | null>(null);
  const [pollTrigger, setPollTrigger] = React.useState(0);
  const stopRef = React.useRef<(() => void) | null>(null);

  const { data, start, stop } = useControlledFetch<Summary>(
    summary ? `/api/summary?id=${summary.id}` : undefined,
    {
      autoStop: (data) => data.state === "finished",
    }
  );

  // store stop reference
  React.useEffect(() => {
    stopRef.current = stop;
  }, [stop]);

  const [form, setForm] = React.useState({
    videoUrl: "",
    model: DEFAULT_LLM_MODEL,
  });

  // Start polling ketika pollTrigger berubah (bukan hanya summary.id)
  React.useEffect(() => {
    if (summary?.id && pollTrigger > 0) {
      // Force stop dulu sebelum start baru
      stopRef.current?.();
      // Delay slightly untuk ensure activeRef.current set to false
      const timeout = setTimeout(() => {
        start();
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [pollTrigger, summary?.id, start]);

  React.useEffect(() => {
    if (data && summary?.id === data.id) {
      setSummary((prev: Summary | null) => {
        if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
        return data;
      });
    }
  }, [data, summary?.id]);

  // Reset summary ketika user submit form baru
  React.useEffect(() => {
    if (!summary?.id) {
      stopRef.current?.();
    }
  }, [summary?.id]);

  return (
    <>
      <SummaryResult summary={summary} />
      <SummaryInput
        form={form}
        summary={summary}
        setSummary={setSummary}
        setForm={setForm}
        onNewRequest={() => setPollTrigger((prev) => prev + 1)}
      />
    </>
  );
}
