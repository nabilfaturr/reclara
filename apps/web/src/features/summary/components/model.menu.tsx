"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { DEFAULT_LLM_MODEL, SUPPORTED_LLM_MODELS_DETAILS } from "@reclara/constants";
import { ChevronDown } from "lucide-react";
import React from "react";

type ModelMenuProps = {
  triggerClassName?: string;
  form: {
    videoUrl: string;
    model: typeof DEFAULT_LLM_MODEL;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      videoUrl: string;
      model: typeof DEFAULT_LLM_MODEL;
    }>
  >;
};

export function ModelMenu({ setForm, form, triggerClassName }: ModelMenuProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu onOpenChange={() => setOpen(!open)}>
      <DropdownMenuTrigger className={`${triggerClassName}`} asChild>
        <Button
          variant="outline"
          onClick={() => setOpen(!open)}
          className="bg-muted cursor-pointer shadow-none  text-foreground h-7 text-xs"
          size="sm"
        >
          <ChevronDown
            className={`transition-transform duration-300 ease-in ${
              open ? "rotate-0" : "rotate-180"
            }`}
          />
          {SUPPORTED_LLM_MODELS_DETAILS[form.model].name}
          <span className="sr-only">Select model</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-60">
        {Object.entries(SUPPORTED_LLM_MODELS_DETAILS).map(([key, model]) => (
          <DropdownMenuCheckboxItem
            className="font-sans cursor-pointer"
            checked={key === form.model}
            onCheckedChange={() =>
              setForm((prev) => ({
                ...prev,
                model: key as typeof DEFAULT_LLM_MODEL,
              }))
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
