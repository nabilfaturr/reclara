"use client";

import React from "react";
import { SummaryInput } from "@/features/summary/components/summary.input";
import { DEFAULT_LLM_MODEL } from "@constants";
import { useControlledFetch } from "../hooks/useControlledFetch";
import { Summary } from "@db/schemas/summary.schema";

export function SummaryPage() {
  const [summary, setSummary] = React.useState<Summary | null>(null);
  const hasStartedRef = React.useRef(false);

  const { data, loading, start } = useControlledFetch<Summary>(
    summary ? `/api/summary?id=${summary.id}` : undefined,
    {
      autoStop: (data) => data.state === "finished",
    }
  );

  const [form, setForm] = React.useState({
    videoUrl: "",
    model: DEFAULT_LLM_MODEL,
  });

  React.useEffect(() => {
    if (summary?.id && !hasStartedRef.current) {
      console.log("🚀 Starting polling for summary:", summary.id);
      hasStartedRef.current = true;
      start();
    }
  }, [summary?.id, start]);

  React.useEffect(() => {
    if (data) {
      setSummary((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(data)) return prev;
        return data;
      });
    }
  }, [data]);

  React.useEffect(() => {
    if (!summary?.id) {
      hasStartedRef.current = false;
    }
  }, [summary?.id]);

  return (
    <>
      <SummaryResult summary={summary} loading={loading} />
      <SummaryInput
        start={start}
        form={form}
        setSummary={setSummary}
        setForm={setForm}
      />
    </>
  );
}

function SummaryResult({
  summary,
  loading,
}: {
  summary: Summary | null;
  loading: boolean;
}) {
  return (
    <div className="h-full px-2 pt-24">
      {loading && <p>Loading summary...</p>}
      {summary ? (
        <div>
          <p>ID: {summary.id}</p>
          <p>State: {summary.state}</p>
          {summary.summarize && <p>{summary.summarize}</p>}
        </div>
      ) : (
        <p>Belum ada summary</p>
      )}
    </div>
  );
}
