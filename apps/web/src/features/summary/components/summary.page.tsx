"use client";

import React from "react";
import { SummaryInput } from "@/features/summary/components/summary.input";
import { DEFAULT_LLM_MODEL } from "@constants";

export function SummaryPage() {
  const [form, setForm] = React.useState<{
    videoUrl: string;
    model: typeof DEFAULT_LLM_MODEL;
  }>({
    videoUrl: "",
    model: DEFAULT_LLM_MODEL,
  });

  return (
    <>
      <SummaryResult />
      <SummaryInput form={form} setForm={setForm} />
    </>
  );
}

export function SummaryResult() {
  return (
    <div className="h-full px-2 pt-24">
      <div className="h-full">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore dicta
        possimus unde hic rem non dignissimos iusto illo error et. Saepe
        architecto soluta maiores expedita tempora, porro cupiditate explicabo
        ipsum!
      </div>
    </div>
  );
}
