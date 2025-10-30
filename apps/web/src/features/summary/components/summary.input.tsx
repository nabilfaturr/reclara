"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModelMenu } from "./model.menu";
import { DEFAULT_LLM_MODEL } from "@constants";
import { sendVideoURL } from "../actions";
import { toast } from "sonner";
import { formSchema } from "../validation";

const placeholder = `Input Youtube video URL or ID here`;

type SummaryInputProps = {
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

export function SummaryInput({ form, setForm }: SummaryInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsed = formSchema.safeParse(form);

    if (!parsed.success) {
      return toast.error(parsed.error.issues[0]?.message || "Invalid input", {
        className: "mt-24",
      });
    }

    const formData = new FormData();
    formData.append("videoUrl", form.videoUrl);
    formData.append("model", form.model);

    await sendVideoURL(formData);
  };

  return (
    <form
      className="absolute bottom-0 w-full p-2 cursor-pointer"
      onClick={() => {
        inputRef.current?.focus();
      }}
      onSubmit={handleSubmit}
    >
      <div className="h-26 flex flex-col gap-2 bg-input/30 p-3 rounded-xl">
        <Input
          placeholder={placeholder}
          ref={inputRef}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              videoUrl: e.target.value,
            }))
          }
          className="border-none font-mono shadow-none dark:bg-transparent dark:bg-none"
        />
        <div className="flex items-center justify-end gap-2">
          <ModelMenu
            form={form}
            setForm={setForm}
            triggerClassName="w-fit font-sans"
          />
          <Button className="cursor-pointer bottom" size="sm" type="submit">
            Summarize
          </Button>
        </div>
      </div>
    </form>
  );
}
