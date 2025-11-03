export const SUPPORTED_LLM_MODELS = [
  "llama4-maverick-instruct-basic",
  "gpt-oss-20b",
  "qwen3-14b",
] as const;

export const SUPPORTED_LLM_MODELS_DETAILS: Record<
  (typeof SUPPORTED_LLM_MODELS)[number],
  { name: string; description: string }
> = {
  "llama4-maverick-instruct-basic": {
    name: "LLama 4 Maverick",
    description: "Basic instruction-following model.",
  },
  "qwen3-14b": {
    name: "Qwen 3",
    description: "14B parameter model.",
  },
  "gpt-oss-20b": {
    name: "GPT-OSS 20B",
    description: "20B Open-source large language model.",
  },
};

export const DEFAULT_LLM_MODEL: (typeof SUPPORTED_LLM_MODELS)[number] =
  "llama4-maverick-instruct-basic";
