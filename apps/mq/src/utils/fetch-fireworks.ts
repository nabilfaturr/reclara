import { config } from "dotenv";
import { join } from "path";
import { summarySchema } from "./fireworks-respons-schema";

config({ path: join(import.meta.dir, "../../.env.local") });

type FireworksModel = "deepseek-v3p1-terminus" | "gpt-oss-20b" | "gpt-oss-120b";

interface FireworksParams {
  model: FireworksModel;
  prompt: string;
  max_tokens?: number;
  temperature?: number;
}

interface FireworksResponse {
  choices: Array<{
    text: string;
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

function getModelIdentifier(model: FireworksModel): string {
  const modelMap: Record<FireworksModel, string> = {
    "deepseek-v3p1-terminus":
      "accounts/fireworks/models/deepseek-v3p1-terminus",
    "gpt-oss-20b": "accounts/fireworks/models/gpt-oss-20b",
    "gpt-oss-120b": "accounts/fireworks/models/gpt-oss-120b",
  };

  return modelMap[model];
}

export async function fetchFireworks(
  model: FireworksModel,
  prompt: string,
  options?: Partial<Omit<FireworksParams, "model" | "prompt">>
): Promise<FireworksResponse> {
  const apiKey = process.env.FIREWORKS_API_KEY;

  if (!apiKey) {
    throw new Error("FIREWORKS_API_KEY environment variable is not set");
  }

  const response = await fetch(
    "https://api.fireworks.ai/inference/v1/completions",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: getModelIdentifier(model),
        prompt: prompt,
        max_tokens: options?.max_tokens ?? 2048,
        temperature: options?.temperature ?? 0.3,
        top_p: 1,
        top_k: 40,
        presence_penalty: 0,
        frequency_penalty: 0,
        response_format: {
          type: "json_schema",
          json_schema: summarySchema,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Fireworks API error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return response.json() as Promise<FireworksResponse>;
}

export type { FireworksModel, FireworksParams, FireworksResponse };
