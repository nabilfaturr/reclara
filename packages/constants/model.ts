export const SUPPORTED_LLM_MODELS = [
  "gpt-oss-120b",
  "llama4-maverick-instruct-basic",
  "qwen3-embedding-8b",
] as const;

export const SUPPORTED_LLM_MODELS_DETAILS: Record<
  (typeof SUPPORTED_LLM_MODELS)[number],
  { name: string; description: string }
> = {
  "gpt-oss-120b": {
    name: "GPT-OSS 120B",
    description: "Open-source large language model.",
  },
  "llama4-maverick-instruct-basic": {
    name: "LLama 4 Maverick",
    description: "Basic instruction-following model.",
  },
  "qwen3-embedding-8b": {
    name: "Qwen 3 Embedding",
    description: "8B parameter embedding model.",
  },
};

export const DEFAULT_LLM_MODEL: (typeof SUPPORTED_LLM_MODELS)[number] =
  "gpt-oss-120b";
