"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModelMenu } from "./model.menu";
import { DEFAULT_LLM_MODEL } from "@constants";

const placeholder = `Input Youtube video URL or ID here`;

type SummaryInputProps = {
  selectedModel: typeof DEFAULT_LLM_MODEL;
  setSelectedModel: (model: typeof DEFAULT_LLM_MODEL) => void;
};

export function SummaryInput({
  setSelectedModel,
  selectedModel,
}: SummaryInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <form
      className="absolute bottom-0 w-full p-2 cursor-pointer"
      onClick={() => {
        inputRef.current?.focus();
      }}
    >
      <div className="h-26 flex flex-col gap-2 bg-input/30 p-3 rounded-xl">
        <Input
          placeholder={placeholder}
          ref={inputRef}
          className="border-none font-mono shadow-none dark:bg-transparent dark:bg-none"
        />
        <div className="flex items-center justify-end gap-2">
          <ModelMenu
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            triggerClassName="w-fit font-sans"
          />
          <Button className="cursor-pointer bottom" size="sm">
            Summarize
          </Button>
        </div>
      </div>
    </form>
  );
}
