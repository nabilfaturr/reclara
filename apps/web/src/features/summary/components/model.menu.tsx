"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { DEFAULT_LLM_MODEL, SUPPORTED_LLM_MODELS_DETAILS } from "@constants";
import { ChevronDown } from "lucide-react";
import React from "react";

type ModelMenuProps = {
  triggerClassName?: string;
  setSelectedModel: (model: typeof DEFAULT_LLM_MODEL) => void;
  selectedModel: typeof DEFAULT_LLM_MODEL;
};

export function ModelMenu({
  triggerClassName,
  setSelectedModel,
  selectedModel,
}: ModelMenuProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu onOpenChange={() => setOpen(!open)}>
      <DropdownMenuTrigger className={`${triggerClassName}`} asChild>
        <Button
          variant="outline"
          onClick={() => setOpen(!open)}
          className="bg-muted cursor-pointer shadow-none  text-foreground h-7 text-sm"
          size="sm"
        >
          <ChevronDown
            className={`transition-transform duration-300 ease-in ${
              open ? "rotate-0" : "rotate-180"
            }`}
          />
          {SUPPORTED_LLM_MODELS_DETAILS[selectedModel].name}
          <span className="sr-only">Select model</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60">
        {Object.entries(SUPPORTED_LLM_MODELS_DETAILS).map(([key, model]) => (
          <DropdownMenuCheckboxItem
            className="font-sans cursor-pointer"
            checked={key === selectedModel}
            onCheckedChange={() =>
              setSelectedModel(key as typeof DEFAULT_LLM_MODEL)
            }
            key={key}
          >
            <p className="flex flex-col">
              <span>{model.name}</span>
              <span className="text-xs text-muted-foreground">
                {model.description}
              </span>
            </p>
          </DropdownMenuCheckboxItem>
        ))}
        {/* {SUPPORTED_LLM_MODELS_DETAILS.map((model) => (
          <DropdownMenuCheckboxItem
            className="font-sans cursor-pointer"
            checked={model.name === selectedModel}
            onCheckedChange={() => setSelectedModel(model.name)}
            key={model.name}
          >
            {model}
          </DropdownMenuCheckboxItem>
        ))} */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
